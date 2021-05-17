$(function(){

    // receber os valores dos lados
    
    $("#botao").click(function(){
        let l1 = $("#valor1").val();
        let l2 = $("#valor2").val();
        let l3 = $("#valor3").val();
        
        console.log (l1);
        
        // verificar se os números são válidos 
        
        if(l1<=0 || l2<=0 || l3<=0)
        {
            $("#resultado").text("Por favor, insira valores compativeis.");
        }
        else
        {
            $("#resultado").text("O seu triângulo é considerado " +
             tr(l1,l2,l3));
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
            return "inexistente, devido aos seus tamanhos.";
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
