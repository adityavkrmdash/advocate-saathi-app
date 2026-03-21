# ================================================
# ADVOCATE SAATHI — CASE CLASSIFIER
# ml_server/classifier.py
#
# Classifies user's legal problem text into a
# legal category using keyword matching + ML.
#
# HOW TO UPGRADE:
#   Replace keyword_classify() with a trained
#   scikit-learn or HuggingFace BERT model.
# ================================================

import re
import os
import joblib

# ── Load trained model if it exists ───────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'classifier.pkl')
_model = None

def _load_model():
    global _model
    if os.path.exists(MODEL_PATH):
        _model = joblib.load(MODEL_PATH)
        print('✅ ML classifier model loaded.')
    else:
        print('⚠️  No trained model found. Using keyword classifier.')

_load_model()

# ── Category keyword rules ─────────────────────
CATEGORY_RULES = {
    'labour': [
        'salary', 'wage', 'employer', 'employee', 'job', 'fired', 'resign',
        'notice period', 'pf', 'provident fund', 'gratuity', 'labour',
        'workplace', 'termination', 'layoff', 'overtime', 'payslip'
    ],
    'cyber': [
        'fraud', 'upi', 'cyber', 'hack', 'phishing', 'scam', 'otp',
        'online', 'internet', 'banking fraud', 'sextortion', 'ransomware',
        'identity theft', 'social media', 'fake account', 'data breach'
    ],
    'consumer': [
        'consumer', 'refund', 'product', 'defect', 'amazon', 'flipkart',
        'ecommerce', 'warranty', 'service', 'cheated', 'overcharged',
        'billing', 'hospital', 'insurance claim', 'return'
    ],
    'property': [
        'landlord', 'rent', 'deposit', 'property', 'tenant', 'house',
        'flat', 'eviction', 'lease', 'agreement', 'real estate',
        'builder', 'possession', 'registry'
    ],
    'family': [
        'divorce', 'custody', 'marriage', 'dowry', 'family', 'wife',
        'husband', 'domestic violence', 'maintenance', 'alimony',
        'child', 'separation', 'adoption', 'inheritance'
    ],
    'criminal': [
        'assault', 'theft', 'murder', 'fir', 'police', 'crime',
        'stolen', 'robbery', 'harassment', 'threat', 'blackmail',
        'kidnap', 'attack', 'rape', 'abuse', 'accident'
    ],
    'civil': [
        'contract', 'agreement', 'money', 'loan', 'debt', 'dispute',
        'cheque bounce', 'partnership', 'business', 'compensation',
        'damages', 'neighbour', 'encroachment'
    ]
}

def keyword_classify(text: str) -> dict:
    """Rule-based keyword classifier — used when no ML model is trained."""
    text_lower = text.lower()
    scores = {}

    for category, keywords in CATEGORY_RULES.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        scores[category] = score

    best_category = max(scores, key=scores.get)
    best_score    = scores[best_category]

    if best_score == 0:
        best_category = 'civil'

    # Confidence: rough estimate based on keyword matches
    confidence = min(0.5 + (best_score * 0.1), 0.95)

    return { 'category': best_category, 'confidence': round(confidence, 2) }

def ml_classify(text: str) -> dict:
    """Use trained scikit-learn model if available."""
    try:
        prediction = _model.predict([text])[0]
        proba      = max(_model.predict_proba([text])[0])
        return { 'category': prediction, 'confidence': round(float(proba), 2) }
    except Exception as e:
        print(f'ML model error: {e}, falling back to keywords.')
        return keyword_classify(text)

def classify_case(text: str) -> dict:
    """Main entry point — uses ML model if available, else keywords."""
    if _model is not None:
        return ml_classify(text)
    return keyword_classify(text)
