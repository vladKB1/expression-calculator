function expressionCalculator(expr) {    
    expr = "(" + expr + ")";
    expr = expr.split(" ");
    expr = expr.join("");   
    
    //console.log(expr);

    let n = expr.length;
    let open = new Array();
    let close = new Array();
    let res = new Array(n);
    let end = new Array(n);
    let k = 0;

    for (let i = 0; i < n; i++) {
        res[i] = end[i] = 0;

        if (expr[i] === "(") {
            k++;
            open.push(i);        
        } else
        if (expr[i] === ")") {
            k--;
            if (k < 0) {
                throw new Error("ExpressionError: Brackets must be paired");
            }
            close.push(i);           
        }        
    }

    if (k != 0) {
        throw new Error("ExpressionError: Brackets must be paired");
    }
    
    for (let r = 0; r < close.length; r++) {
        let l = open.length - 1;
        while (open[l] > close[r] || open[l] === -1) {
            l--;
        }

        end[close[r]] = open[l];
        end[open[l]] = close[r];

        open[l] = -1;
    }

    for (let i = 0; i < close.length; i++) {        
        let r = close[i];
        let l = end[r];
                        
        //console.log(l, r);

        let num = 0, ll = 0, sign = 1, ff = false;
        for (let j = l + 1; j <= r; j++) {            
            if (!isNaN(expr[j])) {
                if (ll === 0) {
                    ll = j;                    
                } 
            } else {
                if (ll != 0) {
                    if (ff) {
                        if (expr[ll - 1] === "*") {
                            num *= Number(expr.slice(ll, j));
                        } else if (expr[ll - 1] === "/") {
                            //console.log(j);
                            if (Number(expr.slice(ll, j)) === 0) {
                                throw new Error("TypeError: Division by zero.");
                            }
                            num /= Number(expr.slice(ll, j));                                             
                        }
                    } else {
                        num = sign * Number(expr.slice(ll, j));
                    }

                    ll = 0;
                }            

                //console.log (j, num, res[l]);

                if (expr[j] === "+" || expr[j] === "-") {
                    if (expr[j] === "-") sign = -1; else sign = 1;                         

                    res[l] += num;
                    num = 0;
                    ff = false;

                    if (expr[j + 1] === "(") {
                        num = sign * res[j + 1];
                        j = end[j + 1];
                    } 
                } else if (expr[j] === "*" || expr[j] === "/") {
                    ff = true;                       

                    if (expr[j + 1] === "(") {
                        if (expr[j] === "*") {
                            num *= res[j + 1];
                        } else {
                            if (res[j + 1] === 0) {
                                throw new Error("TypeError: Division by zero.");
                            }
                            num /= res[j + 1];                            
                        }
                        j = end[j + 1];
                    }   
                } else if (expr[j] === "(") {
                    num = res[j];
                    j = end[j];                    
                } else if (j === r) {
                    //console.log(num);
                    res[l] += num;                    
                }
            }
            //console.log (j, num, res[l]);
        }
    }

    return res[0];
}

module.exports = {
    expressionCalculator
}

// const expr = "91 + 18 / (  42 + 62 + 84 * 95  ) + 30  ";
// console.log(expressionCalculator(expr));