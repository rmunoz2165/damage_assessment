from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.metrics import confusion_matrix, log_loss, accuracy_score, roc_auc_score, roc_curve, f1_score
from sklearn.linear_model import LogisticRegressionCV, LogisticRegression
from sklearn.ensemble import BaggingClassifier, ExtraTreesClassifier, RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.naive_bayes import GaussianNB
from sklearn.base import TransformerMixin
from sklearn.tree import DecisionTreeClassifier
import pandas as pd


from sklearn.exceptions import ConvergenceWarning
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.simplefilter("ignore", category=DeprecationWarning)
warnings.simplefilter("ignore", category=ConvergenceWarning)


class DenseTransformer(TransformerMixin):

    def fit(self, X, y=None, **fit_params):
        return self

    def transform(self, X, y=None, **fit_params):
        return X.todense()


rs = 42
logreg_penalty = ['l1', 'l2']
logreg_max_iter = [50, 100]
knn_neighbors = [1, 5, 10, 20]
knn_p = [1, 2]
dt_max_depth = [3, 4, 5]
gb_max_depth = [3,4,5]

classification_params = {
    1: {"Pipeline": [('vectorizer', CountVectorizer()),
                     ('classifier', LogisticRegression(random_state=rs))],
        "hyper_params": {
            'vectorizer__ngram_range': [(1,1), (1,2)],
            'classifier__penalty': logreg_penalty,
            'classifier__max_iter': logreg_max_iter}
        },
    2: {"Pipeline": [   ('vectorizer', TfidfVectorizer()),
                        ('classifier', LogisticRegression(random_state=rs))],
        "hyper_params": {
            'vectorizer__ngram_range': [(1,1), (1,2)],
            'classifier__penalty': logreg_penalty,
            'classifier__max_iter': logreg_max_iter}
        },
    3: {"Pipeline": [('vectorizer', CountVectorizer()),
                     ('classifier', LogisticRegressionCV(random_state=rs))],
        "hyper_params": {
            'vectorizer__ngram_range': [(1, 1), (1, 2), (1, 3), (1, 4)]}
        },
    4: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                     ('classifier', LogisticRegressionCV(random_state=rs))],
        "hyper_params": {
            'vectorizer__ngram_range': [(1, 1), (1, 2), (1, 3), (1, 4)]}
        },
    5: {"Pipeline": [ ('vectorizer', CountVectorizer()),
                      ('classifier', MultinomialNB())],
        "hyper_params": {
            'vectorizer__ngram_range': [(1, 1), (1, 2), (1, 3), (1, 4)]},
        },
    6: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                     ('classifier', MultinomialNB())],
        "hyper_params": {
            'vectorizer__ngram_range': [(1, 1), (1, 2), (1, 3), (1, 4)]},
        },
    7: {"Pipeline": [('vectorizer', CountVectorizer()),
                     ('classifier', KNeighborsClassifier())],
        "hyper_params": {
            'classifier__n_neighbors': knn_neighbors,
            'classifier__p': knn_p}
        },
    8: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                     ('classifier', KNeighborsClassifier())],
        "hyper_params": {
            'classifier__n_neighbors': knn_neighbors,
            'classifier__p': knn_p}
        },
    9: {"Pipeline": [('vectorizer', CountVectorizer()),
                     ('classifier', GaussianNB())],
        "hyper_params": {}
        },
    10: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                     ('classifier', GaussianNB())],
        "hyper_params": {}
        },
    11: {"Pipeline": [ ('vectorizer', CountVectorizer()),
                       ('classifier', DecisionTreeClassifier(random_state=42))],
        "hyper_params": {'classifier__max_depth': dt_max_depth}
        },
    12: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                      ('classifier', DecisionTreeClassifier(random_state=42))],
         "hyper_params": {'classifier__max_depth': dt_max_depth}
         },
    13: {"Pipeline": [('vectorizer', CountVectorizer()),
                       ('classifier', RandomForestClassifier(random_state=42))],
         "hyper_params": {}
        },
    14: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                       ('classifier', RandomForestClassifier(random_state=42))],
        "hyper_params": {}
        },
    15: {"Pipeline": [('vectorizer', CountVectorizer()),
                      ('classifier', ExtraTreesClassifier(random_state=42))],
        "hyper_params": {}
        },
    16: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                     ('classifier', ExtraTreesClassifier(random_state=42))],
        "hyper_params": {}
        },
    17: {"Pipeline": [('vectorizer', CountVectorizer()),
                      ('classifier', GradientBoostingClassifier(random_state=rs))],
         "hyper_params": {
            'classifier__max_depth': gb_max_depth}
         },
    18: {"Pipeline": [('vectorizer', TfidfVectorizer()),
                      ('classifier', GradientBoostingClassifier(random_state=rs))],
         "hyper_params": {
             'classifier__max_depth': gb_max_depth}
         }
}


# return best estimator results
def get_score_data(results, X_train, X_test, y_train, y_test):
    """

    :param results:
    :param X_train:
    :param X_test:
    :param y_train:
    :param y_test:
    :return:
    """
    output = []
    sub_scores = {}

   #choosing the best estimator of the lot
    model = results.best_estimator_

    # confusion matrix
    tn, fp, fn, tp = confusion_matrix(y_test, model.predict(X_test)).ravel()

    ##calulating accuracy
    #     accuracy = (tp + tn) / (tp + fp + tn + fn)
    accuracy = round(accuracy_score(y_test, model.predict(X_test)), 2)

    # calculating Misclassification Rate
    mis_calcuations = 1 - accuracy

    # calculating sensitivity
    sensitivity = tp / (tp + fn)

    # calculating specificity
    specificity = tn / (tn + fp)

    # calculating precision
    precision = tp / (tp + fp)

    # to predict roc_auc_score
    try:
        pred_proba = [i[1] for i in model.predict_proba(X_test)]
    except:
        pred_proba = [0 for i in y_test]

    pred_df = pd.DataFrame({'true_values': y_test,
                            'pred_probs': pred_proba})



    # For returning results from the best estimator
    # 1. best score
    output.append(round(results.best_score_, 2))

    # 2.best params
    output.append(results.best_params_)

    # 3.No of 0's and 1's in test
    sub_scores.update({"Not eligible for 401k": y_test[y_test == 0].count()})
    sub_scores.update({"Eligible for 401k": y_test[y_test == 1].count()})

    # 4.No of 0's and 1's predicted
    df = pd.DataFrame({"Preds": model.predict(X_test)})
    try:
        sub_scores.update({"Not eligible for 401k": df.groupby("Preds")["Preds"].value_counts()[0].values[0]})
    except:
        sub_scores.update({"Not eligible for 401k":0})

    try:
        sub_scores.update({"Eligible for 401k": df.groupby("Preds")["Preds"].value_counts()[1].values[0]})
    except:
        sub_scores.update({"Eligible for 401k": 0})

    # 5.baseline
    sub_scores.update({"Baseline accuracy%": round(y_test.value_counts(normalize=True)[0], 2)})

    # 6.Train Score
    sub_scores.update({"Train Scores": round(model.score(X_train, y_train), 2)})

    # 7.Test Score
    sub_scores.update({"Test Scores": round(model.score(X_test, y_test), 2)})

    # 8.Accuracy
    sub_scores.update({"Accuracy": accuracy})

    # 9.Mis Calculations
    sub_scores.update({"Mis Calculations": round(mis_calcuations, 2)})

    # 10.Sensitivity
    sub_scores.update({"Sensitivity": round(sensitivity, 2)})

    # 11.Specificity
    sub_scores.update({"Specificity": round(specificity, 2)})

    # 12.Precision
    sub_scores.update({"Precision": round(precision, 2)})

    # 13.ROC AUC
    sub_scores.update({"ROC AUC": round(roc_auc_score(pred_df['true_values'], pred_df['pred_probs']), 2)})

    # 14.ROC AUC curve
    sub_scores.update({"ROC AUC curve": round(roc_curve(pred_df['true_values'], pred_df['pred_probs']), 2)})

    # 15.F1 Train Score
    sub_scores.update({"F1 score Train": round(f1_score(y_train, model.predict(X_train)), 2)})

    # 16.F1 Test Score
    sub_scores.update({"F1 score Test": round(f1_score(y_test, model.predict(X_test)), 2)})

    # 17.Log loss score
    sub_scores.update({"Log Loss score": round(log_loss(y_test, model.predict(X_test)), 2)})

    # 18.
    if model.score(X_train, y_train) > model.score(X_test, y_test):
        sub_scores.update({"Fit Type": "Overfit"})
    else:
        sub_scores.update({"Fit Type": "Underfit"})

    output.append(sub_scores)

    return output


def model_fit_score(X, y, cp, params):
    """

    :param X:
    :param y:
    :param best_scores:
    :param feature_no:
    :param rp:
    :return:
    """
    # Step 1 : split the data into test/train
    X_train, X_test, y_train, y_test = train_test_split(X, y, shuffle=True, stratify=y, test_size=0.20, random_state=42)

    pipe = Pipeline(params[cp]["Pipeline"])
    hyper_params = params[cp]["hyper_params"]

    # Perform Grid Search
    gridcv = GridSearchCV(pipe,
                          param_grid=hyper_params,
                          cv=5,
                          scoring="accuracy")
    # results
    results = gridcv.fit(X_train, y_train)
    print("Round {} complete".format(cp))
    return get_score_data(results, X_train, X_test, y_train, y_test)



def get_best_scores_params(data, y_col):
    """

    :param data:
    :param y_col:
    :param :
    :return:
    """
    X = data.drop(columns=[y_col])
    y = data[y_col]
    best_scores = {x: [] for x in classification_params}

    for cp in classification_params:
        best_scores[cp] = model_fit_score(X, y, cp, classification_params)

    return best_scores


if __name__ == "__main__":
    pass
