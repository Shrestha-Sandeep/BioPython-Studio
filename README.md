# BioPython Studio

A focused, beginner-to-applied **scientific Python training app for a biologist with microscopy experience**. Original, executable exercises and real microscopy images are used to teach general Python, NumPy, quantitative image analysis, Pandas, statistical reasoning, bioinformatics and introductory scientific machine learning. No arcade characters or streaks.

**[Open the current GitHub-connected app](https://biopython-two.vercel.app/)** · [Complete curriculum](CURRICULUM.md) · [Companion research notebook](notebooks/BioPython_Research_Companion.ipynb)

## What is implemented

- **61 sequential, executable exercises:** 25 original lessons followed by 36 additional intermediate/specialist exercises. Each has a specific task, preloaded variables, editable real Python, hints, verified outputs and changed-input evaluation. The course navigator stays collapsed by default.
- **Real HPA microscopy photographs** fetched from the publisher as needed, with image arrays derived from the decoded blue channel. The visually displayed field matches the inspected teaching array. Truncated downloads are rejected with a Retry control.
- **Real browser Python (Pyodide)** loads scientific libraries on demand. Tested local Python equivalence includes NumPy, Pandas, SciPy, scikit-image, Matplotlib, Biopython and scikit-learn. A first cold download may require substantial time and internet access.
- **Progress is saved locally** in `biopython_studio_personal_v1`, preserving all old lesson identifiers; progress does not synchronize between browsers or devices.
- **Runnable notebook** with HPA download, SHA-256 provenance, segmentation of candidate regions, biological-replicate-aware tables, figures and CSV/JSON exports. An optional cell can read a real user-supplied TIFF/OME-TIFF.

## Scientific limitations

The HPA images are **RGB fluorescence JPEG composites, not raw calibrated fluorescence data**. Any pixel sizes used in the exercises are explicitly illustrative. Binary masks, connected regions, local peaks and machine-learning labels are not verified biological objects; a validated exopher/aggregate/cell detector would require appropriately annotated reference images, acquisition controls and independent evaluation. The FASTA/FASTQ, NGS, experimental metadata, physical-unit and machine-learning datasets are authored teaching examples. Do not infer drug effects or statistical independence from microscope fields.

The in-app course teaches executable scientific Python but is **not an AI conversational tutor, full Jupyter environment, clinical predictor, or validated raw-TIFF analysis tool**. Use the companion notebook for genuine Jupyter transfer and optional real local TIFF inspection.

## References and attribution

Two primary curricular references: [Guillaume Witz, Image Processing for Beginners](https://github.com/guiwitz/PyImageCourse_beginner) and [Jake VanderPlas, Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/). Selective references include [Introduction to Bioimage Analysis](https://bioimagebook.github.io/), [Bio-image Analysis Notebooks](https://haesleinhuepf.github.io/BioImageAnalysisNotebooks/), [The Carpentries Image Processing](https://datacarpentry.github.io/image-processing/), [Python for Biologists](https://www.pythonforbiologists.org/), [Biopython tutorial](https://biopython.org/DIST/docs/tutorial/Tutorial.html) and [scikit-learn documentation](https://scikit-learn.org/stable/user_guide.html).

Image credit: **Human Protein Atlas**, including [HPA-8346](https://images.proteinatlas.org/8346/22_C1_1_blue_red_green.jpg), [HPA-46658](https://images.proteinatlas.org/46658/784_B12_1_blue_red_green.jpg), and [HPA-23394](https://images.proteinatlas.org/23394/182_H7_1_blue_red_green.jpg). See [HPA data terms](https://www.proteinatlas.org/about/licence), currently CC BY 4.0; Thul PJ et al., *Science* (2017), DOI 10.1126/science.aal3321. The images are requested from the publisher with explicit attributions. The written exercises and interface are independently authored, not copies of linked books or teaching notebooks.

## Run and test

Static deployment: host this repository as files (Vercel, GitHub Pages or a local HTTP server). Python runs in a Web Worker via an external Pyodide CDN. No server-side account is necessary. The Python execution boundary is for *the learner's own code*, not a hardened arbitrary-code sandbox.

```bash
python -m pip install numpy pandas scipy scikit-image scikit-learn biopython matplotlib pytest pillow playwright nbformat requests ipython
python -m pytest -q tests/test_harness.py tests/test_chunk1.py tests/test_full.py tests/test_notebook.py
python -m playwright install chromium
python tests/test_complete_ui.py
```

See [TEST_REPORT.md](TEST_REPORT.md) for verification status and outstanding live-browser checks. GitHub `main` is authoritative; Vercel is the deployment target. Keep app UI minimal, maintain this README/CURRICULUM rather than spawning blueprints, and preserve the original 25 lesson IDs. BioCompute and AppDeploy ImageLab are separate projects.