$(function(){

    // receber os valores dos lados
    
    $("#botao").click(function(){
        let l1 = $("#valor1").val();
        let l2 = $("#valor2").val();
        let l3 = $("#valor3").val();
        
        
        // verificar se os números são válidos 
        
        if(lado1<=0 || lado2<=0 || lado3<=0)
        {
            $("#resultado").text("Por favor, insira valores compativeis.");
        }
        else
        {
            $("#resultado").text("O seu Triângulo é considerado " +
             tr(lado1,lado2,lado3));
        }
    })

   
// essa função verá se realmente é possível formar um triângulo com os valores fornecidos
    function tr (l1, l2, l3)
    {
        l1 = parseFloat(l1);
        l2 = parseFloat(l2);
        l3 = parseFloat(l3);
        if(existe(l1, l2, l3) == true)
        {
            return ct(l1, l2, l3);
        }
        else
        {
            return "Infelizmente não é possível formar um triângulo com essas mediads de lado.";
        }
    }
    
    
      function existe (l1, l2, l3)
    {
        if(Math.abs(l2-l3) < l1 && l1 < (l2+l3)
           || Math.abs(l1-l3) < l2 && l2 < (l1+l3)
           || Math.abs(l1-l2) < l3 && l3 < (l1+l2))
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    
   
    function ct (l1, l2, l3)
    {
        if(l1 == l2 && l1 == l3 && l2 == l3)
        {
            return "equilátero.";
        }
        if(l1 == l2 && l1!= l3 || l2 == l3 && l2 != l1 || l3 == l1 && l3 != l2)
        {
            return "isóceles.";
        }
        if(l1 != l2 && l1 != l3 && l3 != l2)
        {
            return "escaleno.";
        }

    }
    
})
