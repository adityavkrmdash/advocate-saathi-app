# ================================================
# ADVOCATE SAATHI — FIR APPLICABILITY LOGIC
# ml_server/fir_logic.py
#
# Determines whether an FIR should be filed
# based on case category + user's answers.
# ================================================

def check_fir_applicable(category: str, answers: dict) -> dict:
    """
    Returns:
        firApplicable    : bool
        reason           : str
        recommendedAuthority : str
        urgency          : 'high' | 'medium' | 'low'
    """

    checker = CATEGORY_CHECKERS.get(category, _default_check)
    return checker(answers)


# ── Per-category FIR logic ─────────────────────

def _labour_check(answers: dict) -> dict:
    months_pending = _get_number(answers, 'months_pending', 0)
    has_evidence   = _is_yes(answers, 'has_evidence')
    is_terminated  = _is_yes(answers, 'is_terminated')

    fir = months_pending >= 3 or is_terminated
    return {
        'firApplicable': fir,
        'reason': (
            'FIR applicable under IPC Section 406 (criminal breach of trust) — '
            'employer has withheld wages for 3+ months.'
            if fir else
            'Labour dispute is better resolved through Labour Commissioner or Labour Court '
            'rather than a police FIR at this stage.'
        ),
        'recommendedAuthority': 'Nearest Police Station + Labour Commissioner' if fir else 'District Labour Commissioner',
        'urgency': 'high' if months_pending >= 3 else 'medium'
    }

def _cyber_check(answers: dict) -> dict:
    amount_lost = _get_number(answers, 'amount_lost', 0)
    has_evidence = _is_yes(answers, 'has_evidence')

    return {
        'firApplicable': True,  # Cyber fraud always warrants FIR
        'reason': (
            'FIR is strongly recommended under IT Act Section 66C and 66D. '
            'File immediately — faster action increases chance of fund recovery.'
        ),
        'recommendedAuthority': 'Cyber Crime Cell / cybercrime.gov.in / Call 1930',
        'urgency': 'high'
    }

def _consumer_check(answers: dict) -> dict:
    value = _get_number(answers, 'value', 0)
    contacted_seller = _is_yes(answers, 'contacted_seller')

    fir = value >= 50000  # High value = consider FIR for fraud
    return {
        'firApplicable': fir,
        'reason': (
            'For high-value consumer fraud (50,000+), FIR under IPC Section 420 is applicable.'
            if fir else
            'Consumer forum is the correct approach. FIR is not necessary at this stage.'
        ),
        'recommendedAuthority': (
            'District Consumer Forum + Police Station'
            if fir else
            'District Consumer Disputes Redressal Commission'
        ),
        'urgency': 'high' if fir else 'medium'
    }

def _property_check(answers: dict) -> dict:
    days_since_vacate = _get_number(answers, 'days_since_vacate', 0)
    amount = _get_number(answers, 'deposit_amount', 0)

    fir = amount >= 100000  # Large deposit withholding can be criminal breach of trust
    return {
        'firApplicable': fir,
        'reason': (
            'FIR applicable under IPC Section 406 for criminal breach of trust — '
            'significant amount withheld without valid reason.'
            if fir else
            'This is a civil matter. Approach Rent Control Court or Civil Court for money recovery.'
        ),
        'recommendedAuthority': (
            'Police Station + Rent Control Court'
            if fir else
            'Rent Control Court / Civil Court'
        ),
        'urgency': 'medium'
    }

def _family_check(answers: dict) -> dict:
    has_violence = _is_yes(answers, 'has_violence')
    return {
        'firApplicable': has_violence,
        'reason': (
            'FIR applicable under Protection of Women from Domestic Violence Act, 2005 '
            'and IPC Section 498A (cruelty by husband or relatives).'
            if has_violence else
            'This is a civil family matter. Approach Family Court.'
        ),
        'recommendedAuthority': (
            'Nearest Police Station + Women\'s Cell'
            if has_violence else
            'Family Court'
        ),
        'urgency': 'high' if has_violence else 'medium'
    }

def _criminal_check(answers: dict) -> dict:
    return {
        'firApplicable': True,
        'reason': 'Criminal matters always require an FIR under CrPC Section 154.',
        'recommendedAuthority': 'Nearest Police Station',
        'urgency': 'high'
    }

def _default_check(answers: dict) -> dict:
    return {
        'firApplicable': False,
        'reason': 'This appears to be a civil matter. A court case or legal notice is more appropriate than an FIR.',
        'recommendedAuthority': 'Civil Court / High Court',
        'urgency': 'low'
    }

CATEGORY_CHECKERS = {
    'labour':   _labour_check,
    'cyber':    _cyber_check,
    'consumer': _consumer_check,
    'property': _property_check,
    'family':   _family_check,
    'criminal': _criminal_check,
    'civil':    _default_check,
}

# ── Helpers ────────────────────────────────────

def _is_yes(answers: dict, key: str) -> bool:
    val = str(answers.get(key, '')).lower()
    return val in ('yes', 'true', '1', 'y')

def _get_number(answers: dict, key: str, default: float = 0) -> float:
    try:
        return float(answers.get(key, default))
    except (ValueError, TypeError):
        return default
