// ? пишем функцию и внутрь перемещаем участок кода из файла script.js
function slider({container, slide, nextArrow, prevArrow, totalCounter, currentCounter, wrapper, field}) {

	const slides = document.querySelectorAll(slide),
		slider = document.querySelector(container),
		prev = document.querySelector(prevArrow),
		next = document.querySelector(nextArrow),
		total = document.querySelector(totalCounter),
		current = document.querySelector(currentCounter),
		slidesWrapper = document.querySelector(wrapper),
		slidesField = document.querySelector(field),
		width = window.getComputedStyle(slidesWrapper).width; // получаем compluted style (стили от css)

	// индекс определяющий текущее положение в слайдере
	let slideIndex = 1; // 1 тк в прогр идет с 0
	// отступ чтобы понимать какой слайд показывается
	let offset = 0; // насколько мы отступили

	// условие чтобы подставлялся динамически тотал - сколько всего слайдов
	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

	// устанавливаем ширину
	slidesField.style.width = 100 * slides.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	slidesWrapper.style.overflow = 'hidden';


	// перебираем слайды чтобы каждому задать ширину
	slides.forEach(slide => {
		slide.style.width = width;
	});

	slider.style.position = 'relative';

	// обвертка для всех точек (элем навигаци) и их стилизация
	const indicators = document.createElement('ol'),
		// ! созд массив, потом в него будем пушить наши дотсы; потом в условии перекл дотсы
		dots = [];

	indicators.classList.add('carousel-indicators');
	indicators.style.cssText = `
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 15;
		display: flex;
		justify-content: center;
		margin-right: 15%;
		margin-left: 15%;
		list-style: none;
	`;
	slider.append(indicators); // помещаем обвертку внутрь сладера

	// создаем с помощью цикла несколько точек
	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li'); // создаем точки
		// ! задаем атрибут,  i + 1 будет добавлять число к атрибуту начиная с 1
		dot.setAttribute('data-slide-to', i + 1);

		// стилизуем точки
		dot.style.cssText = `
			box-sizing: content-box;
			flex: 0 1 auto;
			width: 30px;
			height: 6px;
			margin-right: 3px;
			margin-left: 3px;
			cursor: pointer;
			background-color: #fff;
			background-clip: padding-box;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
			opacity: .5;
			transition: opacity .6s ease;
		`;

		// когда i == 0 меняем опасити на 1
		if (i == 0) {
			dot.style.opacity = 1;
		}

		// вставляем точки внутрь indicators
		indicators.append(dot);
		// ! в массив dots пушим dot 
		dots.push(dot);
	}

	// функция изменения опасити у dots
	function changeDotsOpacity() {
		// ! у массива дотс изначально будет у каждого дот
		dots.forEach(dot => dot.style.opacity = '.5');
		// ! далее опасити меняем / идет поведение как выше у slides.length - 1
		dots[slideIndex - 1].style.opacity = 1;
	}

	// функция изменения цифр у счетчика слайдера 
	function changeSlideIndex() {
		// в зависимости от контроля слайдиндекс меняем значение где цифры
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	// функция трансормирует строку в цисло и заменяет с помощью replace() удаляем все не числа из стркоки
	function deleteNotDigits(str) {
		return +str.replace(/\D/g, '');
	}

	next.addEventListener('click', () => {
		// если ушли в правую границу (конец слайдера) то перемещаемся в начало
		if (offset == deleteNotDigits(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			// когда мы нажимаем на стрелку вправо,то к offset будет прибавляться ширина еще одного слайда и слайд будет смещаться
			offset += deleteNotDigits(width);
		}

		// сдвигаем слайд
		slidesField.style.transform = `translateX(-${offset}px)`;

		// контролируем слайдиндекс
		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		changeSlideIndex();
		changeDotsOpacity();
	});

	prev.addEventListener('click', () => {
		if (offset == 0) { // тут сравниваем
			// а тут присваиваем
			offset = deleteNotDigits(width) * (slides.length - 1);
		} else {
			offset -= deleteNotDigits(width);
		}

		// сдвигаем слайд
		slidesField.style.transform = `translateX(-${offset}px)`;

		// контролируем слайдиндекс
		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		changeSlideIndex();
		changeDotsOpacity();
	});

	// пишем переключение слайдов (с нумерацией) при кликах на dots реализовываем через  объект событие и атрибут
	dots.forEach(dot => {
		dot.addEventListener('click', (e) => {
			const slideTo = e.target.getAttribute('data-slide-to');

			// ! ниже все меняем при изменение slideTo (кликнули на 4 и цифрра сменилась на 4)
			slideIndex = slideTo;
			offset = deleteNotDigits(width) * (slideTo - 1);

			slidesField.style.transform = `translateX(-${offset}px)`;

			changeSlideIndex();
			changeDotsOpacity();
		});
	});
}

// ! экспортируем используя ES6
export default slider;