# ================================================
# ADVOCATE SAATHI — ML MODEL TRAINER
# ml_server/train.py
#
# Run this ONCE to train and save your classifier:
#   python train.py
#
# After running, classifier.pkl is created in
# ml_server/models/ and the Flask server will
# automatically use it instead of keyword matching.
# ================================================

import os
import joblib
import pandas as pd
from sklearn.pipeline          import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model      import LogisticRegression
from sklearn.model_selection   import train_test_split, cross_val_score
from sklearn.metrics           import classification_report

# ── Load training data ─────────────────────────
DATA_PATH  = os.path.join(os.path.dirname(__file__), 'data', 'training_data.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'classifier.pkl')

def train():
    print('📂 Loading training data...')
    df = pd.read_csv(DATA_PATH)
    print(f'   {len(df)} samples loaded.')
    print(f'   Categories: {df["category"].value_counts().to_dict()}')

    X = df['text']
    y = df['category']

    # ── Build Pipeline ─────────────────────────
    # TF-IDF converts text to numbers
    # LogisticRegression classifies the numbers
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            ngram_range=(1, 2),    # unigrams + bigrams
            max_features=10000,
            sublinear_tf=True,
            stop_words=None        # keep all words (legal terms matter)
        )),
        ('clf', LogisticRegression(
            max_iter=1000,
            C=1.0,
            solver='lbfgs',
            multi_class='auto'
        ))
    ])

    # ── Cross-validation ───────────────────────
    print('\n🔁 Running 5-fold cross-validation...')
    scores = cross_val_score(pipeline, X, y, cv=5, scoring='accuracy')
    print(f'   Accuracy: {scores.mean():.2%} (+/- {scores.std():.2%})')

    # ── Train on full data ─────────────────────
    print('\n🏋️  Training on full dataset...')
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    pipeline.fit(X_train, y_train)

    # ── Evaluate ──────────────────────────────
    y_pred = pipeline.predict(X_test)
    print('\n📊 Classification Report:')
    print(classification_report(y_test, y_pred))

    # ── Save model ────────────────────────────
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    print(f'\n✅ Model saved to: {MODEL_PATH}')
    print('   Restart ml_server/app.py to use the trained model.')

    # ── Quick test ────────────────────────────
    test_cases = [
        'My employer has not paid my salary for 3 months',
        'I lost money in a UPI fraud through phishing',
        'Landlord is not returning my security deposit',
        'E-commerce company refused my refund for defective product',
        'My husband is abusing me mentally and physically',
        'Someone stole my mobile phone on the street',
    ]
    print('\n🧪 Quick predictions:')
    for text in test_cases:
        pred  = pipeline.predict([text])[0]
        proba = max(pipeline.predict_proba([text])[0])
        print(f'   [{pred:10s} {proba:.0%}] {text[:60]}')

if __name__ == '__main__':
    train()
