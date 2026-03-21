# ================================================
# ADVOCATE SAATHI — FOLLOW-UP QUESTION ENGINE
# ml_server/questions.py
#
# Returns smart follow-up questions based on
# the classified legal category. These questions
# help determine if FIR is applicable and build
# a better action plan.
# ================================================

QUESTIONS = {
    'labour': [
        'Do you have a written offer letter or employment contract?',
        'How many months of salary is pending?',
        'Did your employer give any written reason for non-payment?',
        'Are you still employed or have you resigned / been terminated?',
        'Does your company have more than 10 employees?',
    ],
    'cyber': [
        'When did this incident happen?',
        'How much money was lost (in rupees)?',
        'Do you have screenshots or transaction IDs as evidence?',
        'Did you receive any suspicious call, link, or message before this?',
        'Have you already contacted your bank about this?',
    ],
    'consumer': [
        'Do you have the purchase receipt or invoice?',
        'Did you contact the seller or company before approaching us?',
        'What was the seller\'s response to your complaint?',
        'What is the total value of goods or services involved?',
        'When did you make the purchase?',
    ],
    'property': [
        'Do you have a signed rental agreement?',
        'How long ago did you vacate the property?',
        'What is the total deposit amount?',
        'Did the landlord give any written reason for not returning the deposit?',
        'Is the landlord a private individual or a company / institution?',
    ],
    'family': [
        'Is this about divorce, maintenance, custody, or domestic violence?',
        'Are there children involved in this matter?',
        'How long have you been married?',
        'Is there any physical or mental abuse involved?',
        'Have you already consulted a lawyer or approached any authority?',
    ],
    'criminal': [
        'Did this incident happen recently (within last 3 years)?',
        'Do you have any witnesses to the incident?',
        'Do you have any evidence such as photos, videos, or messages?',
        'Have you already approached the police or filed an FIR?',
        'Do you know the identity of the accused person?',
    ],
    'civil': [
        'Is there a written contract or agreement involved?',
        'What is the approximate monetary value of the dispute?',
        'Have you tried resolving this through direct negotiation?',
        'Do you have any documentary evidence to support your claim?',
        'How long ago did this dispute start?',
    ],
}

def get_followup_questions(category: str) -> list:
    """Return follow-up questions for a given legal category."""
    return QUESTIONS.get(category, QUESTIONS['civil'])
