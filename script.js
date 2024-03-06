$(document).ready(function () {
    $('.modal').hide(); //Escondendo o modal para quando o botão for clickado

    //Iniciando e configurando a DataTable
    let pokeTable = new DataTable('#myTable', { 
        lengthMenu: [10],
        searching: false,
        columnDefs: [
            {
                orderable: false,
                targets: [4]
            }
        ],
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/2.0.1/i18n/pt-BR.json',
        },
    });

    //Função para receber os ids que o usuário digitou
    $('#submitButton').click(function (e) { 
        e.preventDefault();
        let inputData = $('.pokemonId').map(function () {
            if ($(this).val()!=null || $(this).val()!=undefined){
                return $(this).val();
            }
        }).get();

        // Requisição AJAX para receber os dados do servidor PHP
        $.ajax({
            type: "POST",
            url: "get_pokemon_data.php",
            dataType: "json",
            data: { ids: inputData }, // Enviando os dados para o PHP
            success: function (response) {
                displayPokemonData(response);
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });


        $('.pokemonId').val(''); // Resetando o valor do modal
        $('.newModalInput').remove(); // Removendo os inputs adicionais
        $('.modal').hide(); //Escondendo o modal

    });
    //Função para mostrar os dados dos pokemons na DataTable
    function displayPokemonData(data) {
        try {
            data.forEach(pokemon => {
                const { name, id } = pokemon;
                const { front_default: sprite } = pokemon.sprites;
                const types = pokemon.types.map(type => type.type.name);

                //Função para criar uma nova linha na DataTable
                pokeTable.row.add([
                    id,
                    name,
                    types,
                    `<img src="${sprite}">`,
                    `<button id="deleteRowButton"><i class="fa-regular fa-trash-can" style="color: #fff;"></i></button>`
                ]).draw(false);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    //Função para fechar e abrir o modal
    $('#showModal').click(function (e) {
        e.preventDefault();
        $('.modal').toggle();
    });

    //Função para fechar o modal
    $('.btn-close').click(function (e) {
        e.preventDefault();
        $('.modal').hide();
    });

    //Função para remover um input adicional do modal
    $('.modal-body').on('click', '#deleteModalInput', function (e) {
        $(this).parent('.newModalInput').remove();
    });

    // Função para adicionar um novo input no modal
    $('#addLine').on('click', function (e) {
        $('.modal-body').append('<div class="newModalInput" style="display: flex; flex-direction: row; gap: 0.75rem;"><p style="vertical-align: middle;">Código:</p><input type="number" class="pokemonId form-control" style="width:80%" required><button id="deleteModalInput"><i class="fa-regular fa-trash-can" style="color: #fff;"></i></button></div>');
    });

    //Função para remover a linha clickada da tabela
    $('#myTable').on('click', '#deleteRowButton', function (e) { // changed id to class
        $(this).parent('td').parent('tr').remove();
    })
});

