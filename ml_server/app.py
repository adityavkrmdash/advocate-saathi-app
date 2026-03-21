# ================================================
# ADVOCATE SAATHI — ML SERVER
# ml_server/app.py
#
# Run with: python app.py
# Runs on:  http://localhost:8000
# ================================================

from flask import Flask, request, jsonify
from flask_cors import CORS

from classifier import classify_case
from questions  import get_followup_questions
from fir_logic  import check_fir_applicable
from guidance   import get_guidance

app = Flask(__name__)
CORS(app)

# ── Health ────────────────────────────────────
@app.route('/health')
def health():
    return jsonify({ 'status': 'ok', 'service': 'Advocate Saathi ML Server' })

# ── Step 1: Classify the legal problem ────────
@app.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    text = data.get('text', '').strip()

    if not text:
        return jsonify({ 'error': 'text is required' }), 400

    result     = classify_case(text)
    category   = result['category']
    confidence = result['confidence']
    questions  = get_followup_questions(category)

    return jsonify({
        'category':          category,
        'confidence':        confidence,
        'followUpQuestions': questions,
        'message':           f'Case classified as {category} law.'
    })

# ── Step 2: Check if FIR is applicable ────────
@app.route('/fir-check', methods=['POST'])
def fir_check():
    data     = request.get_json()
    category = data.get('category', '')
    answers  = data.get('answers', {})

    result = check_fir_applicable(category, answers)

    return jsonify(result)

# ── Step 3: Get full guidance ──────────────────
@app.route('/guidance', methods=['POST'])
def guidance():
    data          = request.get_json()
    category      = data.get('category', '')
    fir_applicable = data.get('firApplicable', False)
    answers       = data.get('answers', {})

    result = get_guidance(category, fir_applicable, answers)

    return jsonify(result)

# ── Start ──────────────────────────────────────
if __name__ == '__main__':
    print('✅ Advocate Saathi ML Server running on port 8000')
    app.run(host='0.0.0.0', port=8000, debug=True)
