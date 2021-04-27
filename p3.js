$(function(){

    $("#botao").click(function(){
        let texto_array = $("#texto_array").val();
          texto_array = texto_array.replace(/\s+/g, '');
        let array = texto_array.split(",");
        let tam = array.length;
                      if(array[tam-1] == "")
        {
            array.pop();
        }
        $("#resultado").html(fibonacci(texto_array));
    })

                     $("#limpar").click(function(){
                          $("#resultado").text("");
                                $("#texto_array").val("");
    })



    
    function fibonacci (x) 
    {
        let array = new Array;
        let y = 0;
        let z = 1;
        let w = 0;
        for (let i=0; i<x; i++) 
        {
            array.push(w);
            w = y + z;
               y = z;
            z = w;
               }
        return array.join(",");
    }

})