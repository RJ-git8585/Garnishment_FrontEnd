def state_priority_order(state):
    state = state.lower()
    if state in ['alabama', 'alaska', 'arizona', 'arkansas', 'colorado', 'georgia', 
                 'illinois', 'massachusetts', 'michigan', 'ohio', 'pennsylvania', 
                 'virginia', 'washington', 'wisconsin', 'wyoming']:
        result = ['child support', 'federal tax levies', 'state tax levies', 'local tax levies', 
                  'bankruptcy orders', 'federal agency garnishments (non-irs)', 
                  'consumer debts', 'student loans']
    elif state in ['connecticut', 'delaware', 'hawaii', 'idaho', 'indiana', 'iowa', 
                   'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'minnesota', 
                   'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 
                   'new jersey', 'new mexico', 'north carolina', 'north dakota', 'oklahoma', 
                   'oregon', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 
                   'utah', 'vermont', 'west virginia', 'district of columbia']:
        result = ['child support', 'chapter 13 bankruptcy orders', 'irs tax levies', 
                  'federal agency garnishments (non-irs)', 'state tax levies', 
                  'local tax levies', 'consumer debts', 'student loans']
    elif state in ["california","new york"]:
        result = ['child support', 'bankruptcy orders', 'federal tax levies', 'state tax levies', 'local tax levies', 'federal agency garnishments (non-irs)', 'consumer debts', 'student loans']

    elif state == "texas":
        result = ['child support', 'federal tax levies', 'state tax levies', 'local tax levies', 'federal agency garnishments (non-irs)', 'consumer debts', 'student loans', 'bankruptcy orders']
    return result


        
