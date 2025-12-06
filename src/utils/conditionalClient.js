export function shouldShowQuestion(rules, answers) {
  if(!rules) return true;
  const results = (rules.conditions || []).map(cond => {
    const left = answers ? answers[cond.questionKey] : undefined;
    const op = cond.operator;
    const val = cond.value;
    if(op === "equals") return left === val;
    if(op === "notEquals") return left !== val;
    if(op === "contains"){
      if(Array.isArray(left)) return left.includes(val);
      if(typeof left === "string") return String(left).includes(String(val));
      return false;
    }
    return false;
  });
  return rules.logic === "AND" ? results.every(Boolean) : results.some(Boolean);
}
