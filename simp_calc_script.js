//Functions neeeded for the calculator 
//Author: Ryan Arendt
//Last Edited: 8/15/2020

//Simple Calc. Volume 01


let screen_state = [];

function num_button_press(btn_num)
{
    screen_state.push(btn_num);
    update_screen(screen_state);
};

function op_button_press(op_btn)
{
    screen_state.push(op_btn);
    update_screen(screen_state);
};

function clear_button_press()
{
    screen_state = [];
    update_screen(screen_state);

};

function equal_button_press()
{   //When the equal button is pressed, the current screen state is converted from
    //a string to an array of numbers and math operators. Before that array is evaluated,
    //it must be checked to ensure that it is a valid math expression and the propper
    //erros should be shown to the user.
    
    let has_valid_ops = check_valid_ops(screen_state);
    let has_div_zero = check_div_by_zero(screen_state);
    let has_valid_paren = check_valid_paren(screen_state);
    let math_expr = gen_math_exp(screen_state);
 
    if(has_valid_ops && !has_div_zero && has_valid_paren)
    {  
        let ans = evaluate(math_expr);
        document.getElementById("calc_disp").innerHTML = ans;
    }
    else
    {   
        if(!has_valid_ops)
        {   
            let error_msg = "Error: Invalid Operation Set";
            document.getElementById("calc_disp").innerHTML = error_msg;
            
        }
        else if(has_div_zero)
        {   
            let error_msg = "Error: Division By Zero";
            document.getElementById("calc_disp").innerHTML = error_msg;
        }
        else if(!has_valid_paren)
        {   
            let error_msg = "Error: Invalid Parenthesis";
            document.getElementById("calc_disp").innerHTML = error_msg;
        }
        else
        {   let error_msg = "Error: Invalid Math Expression";
            document.getElementById("calc_disp").innerHTML = error_msg;
        }

    }
};

function check_valid_ops(screen_arr)
{
    //Use: to determine if a given mathematical expression entered into
    //      the calculator screen has a valid operation string. For example,
    //      once the user enters 2+/4 that is a wrong operation string.
    //      We can check this, before we check for parenthesis. 

    let op_chars = ["+", "-", "*", "/"];

    for(let i=0; i<screen_arr.length-1; i++)
    {   
        if(op_chars.indexOf(screen_arr[i]) !== -1 && op_chars.indexOf(screen_arr[i+1]) !== -1)
        {   
            return false;          
        }
    }
    return true;

};

function check_valid_paren(screen_arr)
{   //Use:  Before the screen state is evaulated the math expression must be 
    //      checked to see if it has valid parenthesis. 
    
    let paren_stack = [];

    for(let i=0; i<screen_arr.length; i++)
    {
        if(screen_arr[i] == "(" || screen_arr[i] == ")")
        {
            if(screen_arr[i] == "(")
            {
                paren_stack.push(screen_arr[i]);
            }
            else
            {   
                //Stack should contain only opening parens at this point
                if(paren_stack.length == 0)
                {   
                    return false;
                }
                let cur_char = paren_stack.pop();

                if(screen_arr[i] !== ")")
                {   
                    return false;
                }
            }   
        }     
    }
    if(paren_stack.length !== 0)
    {   
        return false;
    }
    return true;
};

function check_div_by_zero(screen_arr)
{   //Use:  Before the screen state is evaulated; the math expression must be checked
    //      to see if there is division by zero. Also an expression such as 24/05
    //      is invalid an an error should be thrown. 

    for(let i=0; i<screen_arr.length-1; i++)
    {
        if(screen_arr[i] == "/"&& screen_arr[i+1] == "0")
        {
            console.log("DIVISON BY ZERO");
            return true;
        }
    }
    return false;

};


function gen_math_exp(screen_arr)
{   //Use: We need to convert the string of integer and operator characters
    //(ex: ['1', '2', +, '3' * '1', '5']) on that contains the valid numbers and expreesions
    //(ex: [12, +, 3, *, 15]) as pre-processing for evaluating the expression
    let temp_str = "";
    let math_chars = ["+", "-", "*", "/", "(", ")"];
    let math_exp = [];

    for(let i=0; i<screen_arr.length; i++)
    {   console.log("temp_str", temp_str);
        if(math_chars.indexOf(screen_arr[i]) == -1)
        {
            temp_str += screen_arr[i];
        }
        else
        {   //console.log("temp_str", temp_str);
            if(temp_str !== "")
            {
                math_exp.push(parseInt(temp_str));
            }
            //math_exp.push(parseInt(temp_str));
            temp_str = "";
            math_exp.push(screen_arr[i]);
        }
    }
    //Need to add the last number
    if(temp_str != "")
    {
        math_exp.push(parseInt(temp_str));
    }
    //math_exp.push(parseInt(temp_str));
    console.log(math_exp);
    return math_exp;
}

function get_precedence(op_char)
{
    if(op_char == "+" || op_char == "-")
    {
        return 1;
    }
    if(op_char == "*" || op_char == "/")
    {
        return 2;
    }
    return 0; 
}

function apply_op(x, y, op_char)
{
    if(op_char == "+"){return x + y}
    if(op_char == "-"){return x - y}
    if(op_char == "*"){return x*y}
    if(op_char == "/"){return x/y}

}

function evaluate(math_arr)
{   //This function takes in an array of integers and math operations, which represents
    //a math expression and evaulates it. 
    //Use:  When the equal button is pressed.This function expects a valid math expression
    //      with balanced parenthesis, so it is important to check before this
    //      function is called. This function could also be adapted for a string.
    //Adatpted from:
    ////https://www.geeksforgeeks.org/expression-evaluation/

    let val_stack = [];
    let op_stack = [];

    i = 0;

    while(i<math_arr.length)
    {
        let cur_char = math_arr[i];

        //If current character is an opening paren, 
        //push it to the op stack 
        if(cur_char == "(") 
        {   
            op_stack.push(cur_char);
        }
        //If current character is a number, push it to 
        //the number stack.
        else if(typeof(cur_char) === "number") 
        {   
            val_stack.push(cur_char);
        }
        //Hit a closing parenthesis: solve the sub expression
        //inside the parenthesis. 
        else if(cur_char === ")")
        {   
            while(op_stack.length !=0 && op_stack[op_stack.length-1] != "(")
            {
                let x = val_stack.pop();
                let y = val_stack.pop();

                let cur_op = op_stack.pop();

                val_stack.push(apply_op(x, y, cur_op));

            }
            op_stack.pop();

        }
        //current character is an operator 
        else
        {   
            //White the top to the op_stack has the same or 
            //greater precedence than the current operator
            //apply that operator to the top to elements
            //in the value stack
            while(op_stack.length !=0 && get_precedence(op_stack[op_stack.length-1]) >= get_precedence(cur_char))
            {   
                
                let a = val_stack.pop();
                let b = val_stack.pop();

                let cur_op = op_stack.pop();

                val_stack.push(apply_op(a, b, cur_op));
            }
            op_stack.push(cur_char);

        }

        i++; 
    }
    //The entire expression has been parsed, apply the
    //remaining operation to the remaning values. 

    while(op_stack.length != 0)
    {   
    
        let val2 = val_stack.pop();
        let val1 = val_stack.pop();
        let op = op_stack.pop();

        val_stack.push(apply_op(val1, val2, op));

    }

    return val_stack.pop();
}

//Note: would it make sence to make this fuction more robust. Currently
//it is only used when numbers are called and doesnt fully hande every
//case of the screen being updated. 

function update_screen(screen_arr)
{
    
    document.getElementById("calc_disp").innerHTML = screen_arr.join("");

};
