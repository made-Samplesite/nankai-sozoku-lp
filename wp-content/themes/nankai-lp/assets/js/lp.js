/* 南海不動産 相続・買取LP v2 の動き */
(function () {
	'use strict';
	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	/* ---------- ローディング（最初から不透明。消えるときだけフェード） ---------- */
	var loader = document.getElementById('nklp-loader');
	if (loader) {
		var bar = document.getElementById('nklp-loader-bar');
		var pct = document.getElementById('nklp-loader-percent');
		var cur = 0, done = false, shownAt = Date.now();
		var paint = function () { if (bar) { bar.style.width = cur + '%'; } if (pct) { pct.textContent = Math.round(cur) + '%'; } };
		var tick = function () { if (done) { return; } cur += (90 - cur) * 0.08; paint(); setTimeout(tick, 60); };
		tick();
		var finish = function () {
			if (done) { return; }
			done = true;
			var wait = Math.max(0, 600 - (Date.now() - shownAt));
			setTimeout(function () {
				cur = 100; paint();
				setTimeout(function () { loader.classList.add('is-hidden'); document.documentElement.classList.add('is-loaded'); }, 220);
			}, wait);
		};
		if (document.readyState === 'complete') { finish(); } else { window.addEventListener('load', finish); }
		setTimeout(finish, 4000); // 画像が遅くても4秒で開く
		window.addEventListener('pageshow', function (e) { if (e.persisted) { loader.classList.add('is-hidden'); } });
	}

	/* ---------- スクロールで現れる ---------- */
	var targets = document.querySelectorAll('[data-reveal], .collage, .word');
	if (reduce || !('IntersectionObserver' in window)) {
		targets.forEach(function (el) { el.classList.add('is-in'); });
	} else {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
			});
		}, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
		targets.forEach(function (el) { io.observe(el); });
	}

	/* ---------- 数字のカウントアップ ---------- */
	var nums = document.querySelectorAll('[data-count]');
	var countUp = function (el) {
		var to = parseInt(el.getAttribute('data-count'), 10) || 0;
		if (reduce || to === 0) { el.textContent = to; return; }
		var t0 = null, dur = 1100;
		var step = function (t) {
			if (!t0) { t0 = t; }
			var p = Math.min(1, (t - t0) / dur);
			el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
			if (p < 1) { requestAnimationFrame(step); }
		};
		el.textContent = '0';
		requestAnimationFrame(step);
	};
	if ('IntersectionObserver' in window) {
		var nio = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); nio.unobserve(en.target); } });
		}, { threshold: 0.6 });
		nums.forEach(function (el) { nio.observe(el); });
	}

	/* ---------- スクロールに合わせた処理（ヘッダー・流れの線・スマホ下部ボタン） ---------- */
	var hd = document.querySelector('.hd');
	var line = document.querySelector('.steps__line i');
	var steps = document.querySelector('.steps');
	var spCta = document.querySelector('.sp-cta');
	var hero = document.querySelector('.hero');
	var ticking = false;
	var onScroll = function () {
		ticking = false;
		var y = window.scrollY || window.pageYOffset;
		if (hd) { hd.classList.toggle('is-scrolled', y > 40); }
		if (line && steps) {
			var r = steps.getBoundingClientRect();
			var p = (window.innerHeight * 0.7 - r.top) / r.height;
			line.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
		}
		if (spCta) {
			var past = hero ? y > hero.offsetHeight * 0.5 : y > 300;
			spCta.classList.toggle('is-show', past);
		}
	};
	window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
	onScroll();

	/* ---------- フォーム送信後は完了ページへ（広告のコンバージョン計測用） ---------- */
	document.addEventListener('wpcf7mailsent', function (e) {
		var path = location.pathname.replace(/\/+$/, '');
		if (e.target && e.target.closest && e.target.closest('#soudan')) { location.href = path + '/contact-thanks/'; return; }
		var base = path.replace(/\/(assessment|contact)$/, '');
		if (/\/assessment$/.test(path)) { location.href = base + '/assessment-thanks/'; }
		else if (/\/contact$/.test(path)) { location.href = base + '/contact-thanks/'; }
	});
})();

/* かんたん相談：連絡方法に合わせて電話番号・メールの「必須／任意」を切り替える */
(function () {
	function sync() {
		var c = document.querySelector('input[name="contact-way"]:checked');
		var way = c ? c.value : '';
		document.querySelectorAll('[data-need]').forEach(function (s) {
			var on = s.getAttribute('data-need') === way;
			s.textContent = on ? '必須' : '任意';
			s.classList.toggle('is-off', !on);
		});
	}
	document.addEventListener('change', function (e) { if (e.target && e.target.name === 'contact-way') sync(); });
	sync();
})();
