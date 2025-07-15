
let size = 0;
let isLoading = false;

$(document).ready(function() {
    loadPost();

    $('#errorTestButton').on('click', function() {
        showError({ status: 500 })
    });

    $(document).on('mouseenter', '.user-card', function() {
        $(this).css({
            'transform': 'translateY(-4px)',
            'box-shadow': '0 6px 14px rgba(0,0,0,0.12)'
        }) 
    });

    $(document).on('mouseleave', '.user-card', function() {
        $(this).css({
            'transform': 'translateY(0)',
            'box-shadow': '0 4px 10px rgba(0,0,0,0.06)'
        }) 
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 100 && !isLoading){
            loadPost();
        }
    });
});

{}

function showError(error) {
    const message = error?.status
        ? `Hata Oluştu (Kod: ${error.status})`
        : 'Bilinmeyen bir hata oluştu';

        $('#errorBox')
        .text(message)
        .fadeIn();

        setTimeout(function() {
            $('#errorBox').fadeOut();
        }, 3000);
}

function loadPost() {
    isLoading = true;
    $('#loader').show();

    $.ajax({
        url: `https://jsonplaceholder.typicode.com/users?_start=${size}&_limit=5`,
        method: 'GET',
    }).done(function(result) {
        if (result.length === 0){
            $('#noMoreData').text('Daha fazla yüklenecek veri yok');
            setTimeout(function(){
                $('#noMoreData').fadeOut();
            }, 3000);
            $(window).off('scroll');
            $('#loader').hide();
            return;
        }
        setTimeout(function() {
            result.forEach(element => {
                $('#postContainer').append(`
                    <div class="user-card">
                        <h2 class="user-name">${element.name}</h2>
                        <p class="user-username">${element.username}</p>
                        <p class="user-email">${element.email}</p>
                        <p class="user-phone">${element.phone}</p>
                        <a class="user-website" target="_blank" href="http://${element.website}">Web sitesine git</a>
                    </div>
                    `)
            });
            size += 5;
            isLoading = false;
            $('#loader').hide();
        }, 1000);
 
    }).fail(function(error) {
        showError(error);
        isLoading = false;
        $('#loader').hide();
    });
}

