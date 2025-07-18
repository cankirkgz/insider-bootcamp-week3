$(document).ready(function () {
    const MAX_USERS = 10;
  
    function createUserCardHTML(user) {
      const uniqueId = `popupDetail-${user.login.uuid}`;
      return `
        <div class="user-image">
            <img class="userProfile" src="${user.picture.medium}" alt="Profil Fotoğrafı">
        </div>
        <div class="user-info">
            <h2 class="user-name">${user.name.first} ${user.name.last}</h2>
            <p>Yaş: ${user.dob.age}</p>
            <p>Cinsiyet: ${user.gender}</p>
            <p>Konum: ${user.location.country} - ${user.location.state}</p>
            <p>Email: <a href="mailto:${user.email}">${user.email}</a></p>
            <button class="detail-button" type="button" data-fancybox data-src="#${uniqueId}">Daha Fazla</button>            
        </div>
      `;
    }
  
    function createPopupHTML(user) {
      const uniqueId = `popupDetail-${user.login.uuid}`;
      return `
        <div style="display: none;" id="${uniqueId}" class="fancybox-content">
            <div class="popup-photo">
                <img src="${user.picture.large}" alt="Profil Fotoğrafı">
                <h2>${user.name.title} ${user.name.first} ${user.name.last}</h2>
            </div>
            <div>
                <p><strong>Yaş:</strong> ${user.dob.age} (${new Date(user.dob.date).toLocaleDateString()})</p>
                <p><strong>Telefon:</strong> ${user.phone}</p>
                <p><strong>Adres:</strong> ${user.location.street.name} No: ${user.location.street.number}, ${user.location.city}, ${user.location.state}, ${user.location.country}</p>
                <p><strong>Posta Kodu:</strong> ${user.location.postcode}</p>
                <p><strong>Koordinatlar:</strong> ${user.location.coordinates.latitude}, ${user.location.coordinates.longitude}</p>
                <p><strong>Zaman Dilimi:</strong> ${user.location.timezone.description} (${user.location.timezone.offset})</p>
                <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
                <p><strong>Kullanıcı Adı:</strong> ${user.login.username}</p>
                <p><strong>Şifre:</strong> ${user.login.password}</p>
                <p><strong>Vatandaşlık:</strong> ${user.nat}</p>
                <p><strong>Kayıt Tarihi:</strong> ${new Date(user.registered.date).toLocaleDateString()}</p>
                <div class="message-button-container">
                    <button class="message-button">Bana Mesaj At</button>
                </div>
            </div>
        </div>
      `;
    }
  
    function createSliderCardHTML(user) {
      const uniqueId = `popupDetail-${user.login.uuid}`;
      return `
        <div class="user-slider-card">
            <img src="${user.picture.medium}" alt="Profil Fotoğrafı">
            <h4>${user.name.first} ${user.name.last}</h4>
            <p>${user.location.country}</p>
            <button class="detail-button" type="button" data-fancybox data-src="#${uniqueId}">Detay</button>
        </div>
      `;
    }
  
    function initializeSlider() {
      $('#user-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        infinite: false,
        arrows: true,
        responsive: [
          { breakpoint: 1024, settings: { slidesToShow: 3 } },
          { breakpoint: 600, settings: { slidesToShow: 2 } },
          { breakpoint: 400, settings: { slidesToShow: 1 } }
        ]
      });
    }
  
    function setupEvents() {
      $(document).on('mouseenter', '.user-slider-card', function () {
        $(this).addClass('hovered');
      }).on('mouseleave', '.user-slider-card', function () {
        $(this).removeClass('hovered');
      });
  
      $(document).on('click', '.message-button', function () {
        Fancybox.getInstance().close();
        setTimeout(function() {
            const $card = $('<div class="message-sent-card">Mesaj Gönderildi!</div>');
            $('#message-queue').append($card);
            setTimeout(function() {
                $card.addClass('slide-out');
                $card.on("animationend", function() {
                    if ($card.hasClass('slide-out')) {
                        $(this).remove();
                    }
                });
            }, 5000);
        }, 200);
      });

      $('#user-card').hover(function () {
        $(this).toggleClass('hovered')
      });
    }
  
    function startShakeEffect() {
      setInterval(() => {
        $('.message-button:visible').effect("shake", { times: 4, distance: 5 }, 600);
      }, 4000);
    }
  
    function showLoading() {
      $('body').append('<p id="loading-text">Yükleniyor...</p>');
    }
  
    function hideLoading() {
      $('#loading-text').remove();
    }
  
    function startApp() {
      showLoading();
  
      $.ajax({
        url: 'https://randomuser.me/api/',
        method: 'GET',
        dataType: 'json'
      }).done(function (mainUserData) {
        const user = mainUserData.results[0];
        $('#welcome-user-title').text(`${user.name.first} ile tanış!`).slideDown();
        $('#user-card')
        .html(createUserCardHTML(user))
        .css({ opacity: 0, marginTop: '50px' })
        .animate({ opacity: 1, marginTop: '0px' }, 500)
        .queue(function(next) {
            $(this).css('transform', 'scale(1.05)')
                   .animate({ transform: 'scale(1)' }, 300, 'swing', next);
        })
        .queue(function(next) {
            $(this).css('box-shadow', '0 0 0 rgba(26, 115, 232, 0.4)')
                   .animate({ 
                       'box-shadow': '0 0 20px rgba(26, 115, 232, 0.6)' 
                   }, 200)
                   .animate({ 
                       'box-shadow': '0 0 10px rgba(26, 115, 232, 0.3)' 
                   }, 300, next);
        });        $('#popup-container').append(createPopupHTML(user));
  
        $.ajax({
          url: `https://randomuser.me/api/?results=${MAX_USERS}`,
          method: 'GET',
          dataType: 'json'
        }).done(function (sliderData) {
          sliderData.results.forEach(function (user) {
            $('#user-slider').append(createSliderCardHTML(user));
            $('#popup-container').append(createPopupHTML(user));
          });
  
          initializeSlider();
          $('#user-slider').fadeIn(300);
          Fancybox.bind("[data-fancybox]");
          setupEvents();
          startShakeEffect();
          hideLoading();
        }).fail(function () {
          $('#error-message').text("Slider verileri alınamadı.").show();
          hideLoading();
        });
      }).fail(function () {
        $('#error-message').text("Kullanıcı bilgileri alınamadı.").show();
        hideLoading();
      });
    }
  
    startApp();
  });
  

  {}