# ================================================
# ADVOCATE SAATHI — GUIDANCE ENGINE
# ml_server/guidance.py
#
# Returns the full legal action plan for a case.
# ================================================

GUIDANCE = {
    'labour': {
        'laws': [
            'Payment of Wages Act, 1936',
            'Industrial Disputes Act, 1947',
            'IPC Section 406 (Criminal breach of trust)',
            'Employees Provident Funds Act, 1952',
        ],
        'steps_fir': [
            'Send written demand notice to employer via registered post (keep a copy)',
            'File complaint with District Labour Commissioner',
            'File FIR at nearest police station under IPC Section 406',
            'Approach Labour Court under Payment of Wages Act',
            'Claim pending salary + 15 days per year gratuity if eligible',
        ],
        'steps_no_fir': [
            'Send written demand notice to employer via registered post',
            'File complaint with District Labour Commissioner',
            'Approach Labour Court for recovery of dues',
            'Claim pending salary + compensation',
        ],
        'documents': [
            'Offer letter or employment contract',
            'Salary slips for relevant months',
            'Bank statements showing missing credits',
            'Resignation letter or termination letter',
            'Any written communication with employer (emails, messages)',
            'PF account statement if PF is also pending',
        ],
    },
    'cyber': {
        'laws': [
            'IT Act Section 66C (Identity theft)',
            'IT Act Section 66D (Cheating by personation using computer)',
            'IPC Section 420 (Cheating and dishonestly inducing delivery)',
            'IPC Section 66 (Computer related offence)',
        ],
        'steps_fir': [
            'Call National Cyber Crime Helpline 1930 IMMEDIATELY',
            'File complaint at cybercrime.gov.in within 24 hours',
            'Contact your bank fraud desk to freeze / reverse the transaction',
            'File FIR at your local police station Cyber Cell',
            'Save all evidence before doing anything else',
        ],
        'steps_no_fir': [
            'Report to cybercrime.gov.in',
            'Contact your bank or payment platform',
            'Block compromised accounts',
            'Change all passwords immediately',
        ],
        'documents': [
            'Screenshots of fraudulent transaction',
            'Transaction ID / UTR number from bank',
            'Bank statement showing debit',
            'Screenshots of suspicious messages, links, or calls',
            'Email records if phishing was via email',
        ],
    },
    'consumer': {
        'laws': [
            'Consumer Protection Act, 2019',
            'Consumer Protection (E-Commerce) Rules, 2020',
            'IPC Section 420 (for fraud cases)',
        ],
        'steps_fir': [
            'Send legal notice to company / seller',
            'File complaint at consumerhelpline.gov.in',
            'Approach District Consumer Disputes Redressal Commission',
            'File FIR under IPC Section 420 for large-scale fraud',
            'Claim refund + compensation + litigation costs',
        ],
        'steps_no_fir': [
            'Send written complaint to seller with deadline',
            'File complaint at consumerhelpline.gov.in (Helpline: 1800-11-4000)',
            'Approach District Consumer Forum (claims up to ₹1 Crore)',
            'Claim full refund + compensation + cost of litigation',
        ],
        'documents': [
            'Purchase receipt or tax invoice',
            'Payment proof (bank statement, screenshot)',
            'Photos or videos showing product defect',
            'All communication with seller (emails, chats)',
            'Warranty card if applicable',
            'Delivery proof / courier tracking',
        ],
    },
    'property': {
        'laws': [
            'Transfer of Property Act, 1882',
            'State Rent Control Act (varies by state)',
            'IPC Section 406 (for large amounts)',
        ],
        'steps_fir': [
            'Send formal demand notice via registered post with acknowledgement',
            'File FIR at police station for criminal breach of trust (large amounts)',
            'Approach Rent Control Court',
            'File money recovery suit in Civil Court',
        ],
        'steps_no_fir': [
            'Send formal demand notice via registered post',
            'Approach Rent Control Court of your jurisdiction',
            'File money recovery suit in Civil Court',
            'Claim deposit amount + 18% interest per annum',
        ],
        'documents': [
            'Signed rental / lease agreement',
            'Deposit payment receipt',
            'Proof of vacating (keys returned acknowledgement)',
            'All communication with landlord',
            'Photos of property condition at time of vacation',
            'Bank statement showing deposit payment',
        ],
    },
    'family': {
        'laws': [
            'Hindu Marriage Act, 1955',
            'Special Marriage Act, 1954',
            'Protection of Women from Domestic Violence Act, 2005',
            'IPC Section 498A (cruelty by husband / relatives)',
            'Hindu Minority and Guardianship Act, 1956',
        ],
        'steps_fir': [
            'Contact Women\'s Helpline: 181',
            'File complaint at nearest police station or Women\'s Cell',
            'File FIR under IPC Section 498A and DV Act 2005',
            'Apply for interim protection order in court',
            'File petition in Family Court',
        ],
        'steps_no_fir': [
            'Consult a family law specialist',
            'File petition in Family Court',
            'Attempt mediation if both parties agree',
            'Apply for maintenance under Section 125 CrPC if needed',
        ],
        'documents': [
            'Marriage certificate',
            'ID proofs of both parties',
            'Birth certificates of children (if custody matter)',
            'Income proof (for maintenance)',
            'Medical reports (if domestic violence)',
            'Photos / videos as evidence of abuse if any',
        ],
    },
    'criminal': {
        'laws': [
            'Indian Penal Code (relevant sections)',
            'CrPC Section 154 (FIR)',
            'CrPC Section 156(3) (Magistrate order for FIR)',
        ],
        'steps_fir': [
            'File FIR at nearest police station immediately',
            'If police refuses, approach Judicial Magistrate under CrPC Section 156(3)',
            'Preserve all evidence — photos, videos, medical reports',
            'Hire a criminal defence / prosecution lawyer',
            'Keep a copy of FIR acknowledgement (right under RTI)',
        ],
        'steps_no_fir': [
            'Consult a criminal lawyer',
            'Approach Magistrate directly',
            'File a private complaint if police is unresponsive',
        ],
        'documents': [
            'Written complaint with full facts',
            'Evidence — photos, videos, audio recordings',
            'Medical report (if physical assault)',
            'Witness names and contact details',
            'Any prior threatening messages or communications',
        ],
    },
    'civil': {
        'laws': [
            'Code of Civil Procedure, 1908',
            'Indian Contract Act, 1872',
            'Negotiable Instruments Act, 1881 (for cheque bounce)',
            'Limitation Act, 1963',
        ],
        'steps_fir': [
            'Send legal notice to the other party',
            'File suit in appropriate Civil Court',
            'Apply for interim injunction if urgent',
        ],
        'steps_no_fir': [
            'Send a legal notice to the other party first',
            'Attempt mediation / arbitration if contract allows',
            'File civil suit in appropriate court',
            'Court decides compensation / damages',
        ],
        'documents': [
            'Original contract or agreement',
            'All correspondence with the other party',
            'Payment proofs or bank statements',
            'Any witnesses or supporting evidence',
        ],
    },
}

def get_guidance(category: str, fir_applicable: bool, answers: dict) -> dict:
    guide = GUIDANCE.get(category, GUIDANCE['civil'])
    steps = guide['steps_fir'] if fir_applicable else guide['steps_no_fir']

    return {
        'laws':               guide['laws'],
        'steps':              steps,
        'documents':          guide['documents'],
        'firApplicable':      fir_applicable,
        'authority':          _get_authority(category, fir_applicable),
        'helplineNumbers':    _get_helplines(category),
    }

def _get_authority(category: str, fir_applicable: bool) -> str:
    if fir_applicable:
        return 'Nearest Police Station'
    authorities = {
        'labour':   'District Labour Commissioner / Labour Court',
        'cyber':    'Cyber Crime Cell / cybercrime.gov.in',
        'consumer': 'District Consumer Disputes Redressal Commission',
        'property': 'Rent Control Court / Civil Court',
        'family':   'Family Court',
        'civil':    'Civil Court',
    }
    return authorities.get(category, 'Civil Court')

def _get_helplines(category: str) -> list:
    helplines = {
        'cyber':    [{'name': 'National Cyber Crime Helpline', 'number': '1930'}, {'name': 'Cybercrime Portal', 'number': 'cybercrime.gov.in'}],
        'labour':   [{'name': 'Labour Helpline', 'number': '1800-11-2200'}],
        'consumer': [{'name': 'National Consumer Helpline', 'number': '1800-11-4000'}],
        'family':   [{'name': 'Women Helpline', 'number': '181'}, {'name': 'Police', 'number': '100'}],
        'criminal': [{'name': 'Police', 'number': '100'}, {'name': 'Emergency', 'number': '112'}],
    }
    return helplines.get(category, [{'name': 'Police', 'number': '100'}])
