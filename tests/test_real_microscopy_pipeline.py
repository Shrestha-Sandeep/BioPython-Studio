"""Execute the real-TIFF batch baseline on original uint16 multichannel/OME data."""
import csv
import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
import tifffile

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "projects/real-microscopy/witz_pipeline.py"
spec = importlib.util.spec_from_file_location("witz_baseline", SCRIPT)
baseline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(baseline)


def make_example(path: Path, offset: int = 0) -> np.ndarray:
    yy, xx = np.ogrid[:64, :64]
    first = (yy - 19) ** 2 + (xx - 20) ** 2 <= 9 ** 2
    second = (yy - 40) ** 2 + (xx - 44) ** 2 <= 8 ** 2
    nucleus = np.full((64,64), 75, dtype=np.uint16)
    nucleus[first] = 4500 + offset
    nucleus[second] = 3100 + offset
    signal = np.full((64,64), 200, dtype=np.uint16)
    signal[first] = 1700
    signal[second] = 2500
    data = np.stack((nucleus, signal))
    tifffile.imwrite(path, data, ome=True, photometric="minisblack",
                     metadata={"axes":"CYX"})
    return data


class RealMicroscopyPipeline(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.folder = Path(self.tmp.name)
        self.pathA = self.folder / "unit_a.ome.tif"
        self.pathB = self.folder / "unit_b.ome.tif"
        self.originalA = make_example(self.pathA)
        make_example(self.pathB, 150)
        self.hashA = baseline.sha256(self.pathA)
        self.hashB = baseline.sha256(self.pathB)

    def tearDown(self):
        self.tmp.cleanup()

    def test_native_16bit_OME_axes_and_metadata(self):
        nuc, signal, metadata = baseline.read_tiff(
            self.pathA, channel_nucleus=0, channel_signal=1)
        self.assertEqual(metadata["dtype"], "uint16")
        self.assertEqual(metadata["axes"], "CYX")
        self.assertEqual(metadata["shape"], (2,64,64))
        self.assertTrue(metadata["ome_xml_present"])
        np.testing.assert_array_equal(nuc, self.originalA[0])
        np.testing.assert_array_equal(signal, self.originalA[1])
        self.assertFalse(metadata["source_raw_calibration_verified"])

    def test_ambiguous_axes_require_explicit_z_t(self):
        arr = np.zeros((2,3,4,5,6),dtype=np.uint16)
        with self.assertRaisesRegex(ValueError,"T has 2 planes"):
            baseline.extract_plane(arr,"TZCYX",1,None,0)
        with self.assertRaisesRegex(ValueError,"Z has 3 planes"):
            baseline.extract_plane(arr,"TZCYX",1,0,None)
        np.testing.assert_array_equal(
            baseline.extract_plane(arr,"TZCYX",1,0,2), arr[0,2,1])
        with self.assertRaisesRegex(ValueError,"Unrecognized"):
            baseline.extract_plane(np.zeros((2,3,3)), "QYX",0,None,None)

    def test_rgb_component_axis_is_supported(self):
        rgb = np.arange(7*9*3,dtype=np.uint16).reshape((7,9,3))
        np.testing.assert_array_equal(
            baseline.extract_plane(rgb,"YXS",2,None,None),rgb[:,:,2])
        np.testing.assert_array_equal(
            baseline.extract_plane(rgb.transpose(2,0,1),"CYX",1,None,None),rgb[:,:,1])

    def test_batch_outputs_and_originals_unchanged(self):
        dest=self.folder/"results"
        manifest=baseline.analyze(
            [self.pathA,self.pathB],dest,
            nucleus_channel=0,signal_channel=1,min_area=12,
            median_radius=0,closing_radius=0,edge_width=1)
        self.assertEqual(len(manifest["images"]),2)
        self.assertTrue((dest/"manifest.json").is_file())
        self.assertTrue((dest/"regions.csv").is_file())
        with (dest/"regions.csv").open(newline="",encoding="utf8") as f:
            rows=list(csv.DictReader(f))
        self.assertGreaterEqual(len(rows),2)
        self.assertTrue(all(r["raw_calibrated"]=="False" for r in rows))
        self.assertTrue(all(r["segmentation_validated"]=="False" for r in rows))
        self.assertTrue(all(not r["area_um2"] for r in rows))
        self.assertEqual(baseline.sha256(self.pathA),self.hashA)
        self.assertEqual(baseline.sha256(self.pathB),self.hashB)
        for im in manifest["images"]:
            self.assertTrue((dest/im["overlay"]).is_file())
            self.assertGreater(im["candidate_count"],0)
        newer=baseline.analyze(
            [self.pathA,self.pathB],self.folder/"repeat",
            nucleus_channel=0,signal_channel=1,min_area=12,
            median_radius=0,closing_radius=0,edge_width=1)
        self.assertEqual(
            [x["candidate_count"] for x in manifest["images"]],
            [x["candidate_count"] for x in newer["images"]])

    def test_explicit_scale_is_marked_unverified(self):
        dest=self.folder/"scaled"
        result=baseline.analyze(
            [self.pathA],dest,nucleus_channel=0,signal_channel=1,
            pixel_um=0.31,min_area=12,median_radius=0,closing_radius=0,edge_width=1)
        self.assertEqual(
            result["parameters"]["pixel_um_user_supplied_unverified"],0.31)
        with (dest/"regions.csv").open(newline="",encoding="utf8") as f:
            rows=list(csv.DictReader(f))
        self.assertGreater(len(rows),0)
        for row in rows:
            self.assertAlmostEqual(float(row["area_um2"]),int(row["area_px"])*.31**2)
        self.assertFalse(result["images"][0]["source_raw_calibration_verified"])

    def test_cli_and_channel_validation(self):
        with self.assertRaisesRegex(ValueError,"different"):
            baseline.analyze([self.pathA],self.folder/"bad",nucleus_channel=0,signal_channel=0)
        process=subprocess.run(
            [sys.executable,str(SCRIPT),"--input",str(self.pathA),str(self.pathB),
             "--out",str(self.folder/"cli"),"--nucleus-channel","0","--signal-channel","1",
             "--min-area","12","--median-radius","0","--closing-radius","0"],
            capture_output=True,text=True,timeout=120)
        self.assertEqual(process.returncode,0,process.stderr)
        self.assertIn("Candidate objects:",process.stdout)
        self.assertTrue((self.folder/"cli/regions.csv").exists())


if __name__=="__main__":
    unittest.main(verbosity=2)
