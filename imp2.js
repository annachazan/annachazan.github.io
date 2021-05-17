$(function(){

    $("#botao").click(function(){
        let salario = $("#valor1").val();
        $("#resultado").text(" Segundo seu salário, você pagará = " +
         impos(salario).toFixed(2) 
            + " reais.");
    })

   

    function impos (x)
    {
        x = parseFloat(x);
        if(x <= 1903.99)
        {
            return "Você não precisará pagar nada ";
        }
       else  if(x > 1903.99 && x <= 2826.65)
        {
            return (x* 0.075) - 142.80;
        }
       else  if(x > 2826.65 && x <= 3751.05)
        {
            return (x * 0.15) - 354.80;
        }
       else  if(x > 3751.05 && x <= 4664.68)
        {
            return (x * 0.225) - 636.13;
        }
      else   if(x > 4664.68)
        {
            return (x * 0.275) - 869.36;
        }
    }

    
})