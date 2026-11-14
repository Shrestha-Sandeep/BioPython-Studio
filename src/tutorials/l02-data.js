// L02 — baseline-first synthetic machine-learning model comparisons.
"use strict";
(()=>{window.BioPythonMLTutorials=Object.freeze([...(window.BioPythonMLTutorials||[]),{
  "id": "l02-chapter",
  "chapter": "L02",
  "title": "Compare honest machine-learning baselines",
  "short": "Dummy, regression, logistic and shallow trees",
  "minutes": "15–21 min",
  "goals": [
    "L02-G01",
    "L02-G02",
    "L02-G03",
    "L02-G04",
    "L02-CAPSTONE"
  ],
  "steps": [
    {
      "title": "Can a synthetic image feature beat a trivial prediction?",
      "say": "The scientific challenge is not simply getting a classifier to run. First compare it with a majority-class predictor learned from training labels only, then inspect transparent regression, logistic and tree models against a reserved synthetic holdout. The group independence from L01 is assumed, not re-established here.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Baseline",
          "majority-class training"
        ],
        [
          "Models",
          "regression, logistic, tree"
        ],
        [
          "Evaluation",
          "held-out synthetic subjects"
        ]
      ],
      "output": "",
      "note": "The data are artificially separated training and test fixtures, not real animal-level microscopy measurements or a validated prospective experiment.",
      "goal": "L02-G01"
    },
    {
      "title": "A dummy classifier ignores fluorescence features entirely",
      "say": "DummyClassifier with most_frequent learns only the dominant training label. Here three training labels are zero and one is one, so both test feature values receive the same prediction regardless of their magnitude.",
      "code": "from sklearn.dummy import DummyClassifier\nm=DummyClassifier(strategy='most_frequent').fit([[0],[1],[2],[3]],[0,0,0,1])\nprint(m.predict([[10],[20]]).tolist())",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Training labels",
          "0,0,0,1"
        ],
        [
          "Dominant class",
          "0"
        ],
        [
          "Both predictions",
          "0,0"
        ]
      ],
      "output": "[0, 0]",
      "note": "This baseline can look accurate when outcomes are imbalanced; it has no learned relationship between feature value and biological class.",
      "goal": "L02-G01"
    },
    {
      "title": "Class imbalance changes how to interpret accuracy",
      "say": "Suppose ninety percent of synthetic training subjects have the negative label. A majority-only predictor can report ninety percent training accuracy while failing every positive subject; class composition must be reported alongside any accuracy.",
      "code": "labels=[0]*9+[1]\nprint(len(labels),labels.count(0)/len(labels))",
      "focus": [
        1,
        2
      ],
      "visual": [
        [
          "Training labels",
          "9 negatives, 1 positive"
        ],
        [
          "Majority frequency",
          "0.90"
        ],
        [
          "Minority recall",
          "0 if always negative"
        ]
      ],
      "output": "10 0.9",
      "note": "Many fields from the same animal must not be treated as distinct class examples. This simple array assumes independent subjects for illustration.",
      "goal": "L02-G01"
    },
    {
      "title": "Training majority frequency is not the test-set result",
      "say": "The classifier predicting zero on every row could fit the four training labels at three out of four, but a reserved balanced test with one negative and one positive produces only one correct prediction out of two.",
      "code": "train_y=[0,0,0,1]\ntest_y=[0,1]\nprint(train_y.count(0)/len(train_y),sum(p==y for p,y in zip([0,0],test_y))/len(test_y))",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Train majority",
          "0.75"
        ],
        [
          "Test balance",
          "0,1"
        ],
        [
          "Dummy test accuracy",
          "0.50"
        ]
      ],
      "output": "0.75 0.5",
      "note": "Always distinguish training composition from an honestly held-out result; neither is reliable biological performance with such tiny synthetic samples.",
      "goal": "L02-G01"
    },
    {
      "title": "Predict the held-out majority baseline before revealing it",
      "say": "Train a dummy majority classifier on three zeros and one one. On the invented test labels zero and one, what two classes does it predict and what fraction of the test set is correct? Make a prediction before revealing code output.",
      "code": "from sklearn.dummy import DummyClassifier\nm=DummyClassifier(strategy='most_frequent').fit([[0],[1],[2],[3]],[0,0,0,1])\npred=m.predict([[10],[20]]).tolist()\nprint(pred,sum(x==y for x,y in zip(pred,[0,1]))/2)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Training majority",
          "0"
        ],
        [
          "Held-out labels",
          "0 and 1"
        ],
        [
          "Predictions / accuracy",
          "Withheld"
        ]
      ],
      "output": "",
      "note": "This is a worked checkpoint independent of Apply and Prove. Do not infer performance from a feature-ignorant predictor without checking true held-out labels.",
      "goal": "L02-G01",
      "checkpoint": true
    },
    {
      "title": "Reveal: dummy predicts two zeros and reaches 50%",
      "say": "The most frequent class is zero, so both held-out samples get class zero. Only the true negative is correct, making the balanced two-subject accuracy one half despite seventy-five percent training majority frequency.",
      "code": "from sklearn.dummy import DummyClassifier\nm=DummyClassifier(strategy='most_frequent').fit([[0],[1],[2],[3]],[0,0,0,1])\npred=m.predict([[10],[20]]).tolist()\nprint(pred,sum(x==y for x,y in zip(pred,[0,1]))/2)",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Prediction",
          "0, 0"
        ],
        [
          "True labels",
          "0, 1"
        ],
        [
          "Held-out accuracy",
          "0.50"
        ]
      ],
      "output": "[0, 0] 0.5",
      "note": "The test comprises two invented observations and supplies no confidence interval, subject variability or transferable biological evaluation.",
      "goal": "L02-G01"
    },
    {
      "title": "Linear regression fits an association, not a mechanism",
      "say": "Fit a straight line to three synthetic numeric pairs. The slope is two and the intercept one, so the fitted prediction at a new input of three is seven; this is mathematics on synthetic numbers, not a causal effect of fluorescence.",
      "code": "from sklearn.linear_model import LinearRegression\nm=LinearRegression().fit([[0],[1],[2]],[1,3,5])\nprint(round(float(m.coef_[0]),2),round(float(m.intercept_),2),[round(float(v),2) for v in m.predict([[3]])])",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Slope",
          "2"
        ],
        [
          "Intercept",
          "1"
        ],
        [
          "Prediction at 3",
          "7"
        ]
      ],
      "output": "2.0 1.0 [7.0]",
      "note": "A regression coefficient from observational microscopy data cannot prove the feature causes an outcome, even when the fitted line appears exact.",
      "goal": "L02-G02"
    },
    {
      "title": "Extrapolating far beyond training values is risky",
      "say": "The same model can calculate a value at feature ten, far outside its training range zero to two. The numerical result twenty-one follows the line equation, but there is no experimental evidence that the relation remains linear so far away.",
      "code": "from sklearn.linear_model import LinearRegression\nm=LinearRegression().fit([[0],[1],[2]],[1,3,5])\nprint([round(float(v),2) for v in m.predict([[10]])])",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Trained range",
          "0–2"
        ],
        [
          "New input",
          "10"
        ],
        [
          "Extrapolated result",
          "21"
        ]
      ],
      "output": "[21.0]",
      "note": "A successful predict() call does not certify physical plausibility or extrapolation validity. Report the training range and uncertainty.",
      "goal": "L02-G02"
    },
    {
      "title": "A residual compares observed and predicted response",
      "say": "In a new invented test case, the model predicts four for input one point five, but the supplied observed response is four point two. Their difference is a residual of zero point two and does not imply a systematic causal effect.",
      "code": "from sklearn.linear_model import LinearRegression\nm=LinearRegression().fit([[0],[1],[2]],[1,3,5])\npred=round(float(m.predict([[1.5]])[0]),2)\nprint(pred,round(4.2-pred,2))",
      "focus": [
        2,
        3,
        4
      ],
      "visual": [
        [
          "Observed test",
          "4.2"
        ],
        [
          "Predicted",
          "4.0"
        ],
        [
          "Residual",
          "0.2"
        ]
      ],
      "output": "4.0 0.2",
      "note": "Inspect distributions of residuals across many independent biological units, not a single point, before trusting a real predictive model.",
      "goal": "L02-G02"
    },
    {
      "title": "Standardize features before regularized logistic regression",
      "say": "A Pipeline first scales the synthetic training signal and then fits a regularized logistic classifier. With zero, one, two and three as training signals, its predicted class for test value two point five is one.",
      "code": "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nm=make_pipeline(StandardScaler(),LogisticRegression(C=1,max_iter=300,random_state=0)).fit([[0],[1],[2],[3]],[0,0,1,1])\nprint(m.predict([[2.5]]).tolist())",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Training",
          "0,1→0; 2,3→1"
        ],
        [
          "Pipeline",
          "scale → logistic"
        ],
        [
          "Test prediction",
          "class 1"
        ]
      ],
      "output": "[1]",
      "note": "The scale factor and model weights are fitted only on training rows. This toy does not verify subjects are independent unless the input provenance is group safe.",
      "goal": "L02-G03"
    },
    {
      "title": "A logistic probability is a model score, not a guaranteed frequency",
      "say": "The fitted logistic model estimates a probability of the positive class for test value two point five. Rounding to one decimal gives roughly zero point seven, but that does not establish empirical calibration on new animals or acquisition batches.",
      "code": "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nm=make_pipeline(StandardScaler(),LogisticRegression(C=1,max_iter=300,random_state=0)).fit([[0],[1],[2],[3]],[0,0,1,1])\nprint(round(float(m.predict_proba([[2.5]])[0,1]),1))",
      "focus": [
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "Synthetic feature",
          "2.5"
        ],
        [
          "Positive model score",
          "about 0.7"
        ],
        [
          "Calibration",
          "not measured"
        ]
      ],
      "output": "0.7",
      "note": "A model probability is conditional on training data and assumptions. Proper calibration requires independent, representative validation with many subjects.",
      "goal": "L02-G03"
    },
    {
      "title": "Smaller C increases regularization strength",
      "say": "Scikit-learn's C is the inverse regularization strength for LogisticRegression. On the same synthetic training data, a smaller C yields a less steep coefficient magnitude than a very large C.",
      "code": "from sklearn.linear_model import LogisticRegression\nX=[[0],[1],[2],[3]];y=[0,0,1,1]\nsmall=LogisticRegression(C=.1,max_iter=300,random_state=0).fit(X,y)\nlarge=LogisticRegression(C=100,max_iter=300,random_state=0).fit(X,y)\nprint(abs(small.coef_[0,0])<abs(large.coef_[0,0]))",
      "focus": [
        1,
        2,
        3,
        4,
        5
      ],
      "visual": [
        [
          "C = 0.1",
          "stronger penalty"
        ],
        [
          "C = 100",
          "weaker penalty"
        ],
        [
          "Coefficient relation",
          "small C shrinks weight"
        ]
      ],
      "output": "True",
      "note": "Regularization may improve generalization, but choosing C using the final held-out test labels contaminates the evaluation.",
      "goal": "L02-G03"
    },
    {
      "title": "Prediction confidence needs its own validation",
      "say": "A classifier returns both class probabilities, which sum to one by construction for this binary model. That arithmetic property does not mean that seventy-percent scores occur correctly seventy percent of the time in an external animal cohort.",
      "code": "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nm=make_pipeline(StandardScaler(),LogisticRegression(C=1,max_iter=300,random_state=0)).fit([[0],[1],[2],[3]],[0,0,1,1])\np=m.predict_proba([[2.5]])[0]\nprint(round(float(p.sum()),3),len(p))",
      "focus": [
        2,
        3,
        4,
        5,
        6
      ],
      "visual": [
        [
          "Probabilities sum",
          "1.0"
        ],
        [
          "Number of classes",
          "2"
        ],
        [
          "Calibration",
          "untested"
        ]
      ],
      "output": "1.0 2",
      "note": "Probability calibration, discrimination and confidence should be assessed separately on subjects truly independent of model selection.",
      "goal": "L02-G03"
    },
    {
      "title": "A depth-limited decision tree makes a transparent split",
      "say": "A shallow classification tree uses a threshold to separate invented low and high feature values. Restrict max_depth to one for this example and inspect the fitted depth instead of assuming that an unconstrained tree will generalize.",
      "code": "from sklearn.tree import DecisionTreeClassifier\nm=DecisionTreeClassifier(max_depth=1,random_state=0).fit([[0],[1],[2],[3]],[0,0,1,1])\nprint(m.get_depth())",
      "focus": [
        1,
        2,
        3
      ],
      "visual": [
        [
          "Training feature",
          "0,1,2,3"
        ],
        [
          "Tree constraint",
          "max depth 1"
        ],
        [
          "Fitted depth",
          "1"
        ]
      ],
      "output": "1",
      "note": "A tree threshold is a numerical decision rule, not a biological discovery about fluorescence, protein localization or developmental mechanism.",
      "goal": "L02-G04"
    },
    {
      "title": "Compare a shallow tree with the dummy on reserved examples",
      "say": "Both models are trained on exactly the same synthetic training labels. The shallow tree correctly separates two held-out numeric examples, while the dummy predicts a constant class; one perfect toy score does not demonstrate robust generalization.",
      "code": "from sklearn.tree import DecisionTreeClassifier\nfrom sklearn.dummy import DummyClassifier\nX=[[0],[1],[2],[3]];y=[0,0,1,1]\ntest_X=[[.5],[2.5]];test_y=[0,1]\ntree=DecisionTreeClassifier(max_depth=2,random_state=0).fit(X,y)\ndummy=DummyClassifier(strategy='most_frequent').fit(X,y)\nprint(tree.score(test_X,test_y),dummy.score(test_X,test_y))",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "visual": [
        [
          "Tree test accuracy",
          "1.0 (2 cases)"
        ],
        [
          "Dummy test accuracy",
          "0.5"
        ],
        [
          "Interpretation",
          "toy demonstration"
        ]
      ],
      "output": "1.0 0.5",
      "note": "Choosing the depth after inspecting final test accuracy would reuse the holdout for tuning. A two-subject test provides almost no stable performance estimate.",
      "goal": "L02-G04"
    },
    {
      "title": "Fix tree depth before the final test",
      "say": "A tree's max_depth is a hyperparameter chosen from training and preferably group-aware validation data. This illustrative comparison checks that fitted complexity respects the requested depth without peeking at any final test label.",
      "code": "from sklearn.tree import DecisionTreeClassifier\nX=[[0],[1],[2],[3]];y=[0,0,1,1]\nmodels=[DecisionTreeClassifier(max_depth=d,random_state=0).fit(X,y) for d in [1,2]]\nprint([m.get_depth()<=m.max_depth for m in models])",
      "focus": [
        1,
        2,
        3,
        4
      ],
      "visual": [
        [
          "Candidate depths",
          "1 and 2"
        ],
        [
          "Constraint",
          "enforced on train"
        ],
        [
          "Final holdout",
          "not for tuning"
        ]
      ],
      "output": "[True, True]",
      "note": "A proper modeling workflow uses group-aware cross-validation for hyperparameter selection and reserves an independent test split for final evaluation.",
      "goal": "L02-G04"
    },
    {
      "title": "Capstone: evaluate a dummy and logistic model on one reserved split",
      "say": "Combine the two baseline classifiers using identical synthetic training and held-out arrays. Fit the regularized standardized logistic classifier and the most-frequent dummy on training only, then report test accuracy and the number of reserved observations.",
      "code": "from sklearn.dummy import DummyClassifier\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nX=[[0],[1],[2],[3]];y=[0,0,1,1]\nX_test=[[.5],[2.5]];y_test=[0,1]\ndummy=DummyClassifier(strategy='most_frequent').fit(X,y)\nmodel=make_pipeline(StandardScaler(),LogisticRegression(C=1,max_iter=300,random_state=0)).fit(X,y)\nprint({'dummy':dummy.score(X_test,y_test),'logistic':model.score(X_test,y_test),'n_test':len(y_test)})",
      "focus": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ],
      "visual": [
        [
          "Dummy",
          "0.5"
        ],
        [
          "Regularized logistic",
          "1.0"
        ],
        [
          "Reserved observations",
          "2 synthetic"
        ]
      ],
      "output": "{'dummy': 0.5, 'logistic': 1.0, 'n_test': 2}",
      "note": "The two held-out examples are synthetic and do not support any credible estimate of external test performance, biology or calibrated prediction.",
      "goal": "L02-CAPSTONE"
    },
    {
      "title": "Independent transfer: evaluate new animal-held-out models",
      "say": "Back in the Python editor, accept unfamiliar prepartitioned training and held-out arrays with an imbalanced label distribution, a feature outside the training range and new positive and negative test cases. Fit a dummy, a train-scaled logistic model and a shallow tree without using test labels for fitting or depth selection, then report class metrics and the source-group provenance.",
      "code": "",
      "focus": [],
      "visual": [
        [
          "Baseline",
          "training-majority only"
        ],
        [
          "Models",
          "fit train; preserve test"
        ],
        [
          "Audit",
          "class metrics and group IDs"
        ]
      ],
      "output": "",
      "note": "Use independent changed inputs and explicitly verify group-level provenance inherited from L01. Passing this synthetic task is not evidence of a transferable biological model.",
      "goal": "L02-CAPSTONE"
    }
  ]
}]);})();
