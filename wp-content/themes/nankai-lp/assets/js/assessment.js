/* 無料査定フォーム：物件種別での項目切替・確認画面（元テーマから引き継ぎ） */
document.addEventListener('DOMContentLoaded', function () {
	var form = document.querySelector('.wpcf7-form');
	if (!form) return;

	/* 物件種別によって部屋数・部屋タイプの表示を切り替え */
	var madoriWrap = document.getElementById('madori-wrap');
	function toggleMadori() {
		if (!madoriWrap) return;
		var checked = form.querySelector('input[name="bukken-type"]:checked');
		var val = checked ? checked.value : '';
		madoriWrap.hidden = !(val === 'マンション' || val === '一戸建て');
	}
	form.querySelectorAll('input[name="bukken-type"]').forEach(function (r) {
		r.addEventListener('change', toggleMadori);
	});
	toggleMadori();

	var stepInput    = document.getElementById('step-input');
	var stepConfirm   = document.getElementById('step-confirm');
	var stepComplete  = document.getElementById('step-complete');
	var stepsNav      = document.getElementById('assessment-steps');
	var btnToConfirm  = document.getElementById('btn-to-confirm');
	var btnBack       = document.getElementById('btn-back');
	var emailField    = form.querySelector('[name="your-email"]');
	var emailConfirm  = form.querySelector('[name="your-email-confirm"]');
	var emailMismatch = document.getElementById('email-mismatch-msg');

	function setActiveStep(n) {
		if (!stepsNav) return;
		stepsNav.querySelectorAll('li').forEach(function (li) {
			li.classList.toggle('is-active', Number(li.dataset.step) === n);
			li.classList.toggle('is-done', Number(li.dataset.step) < n);
		});
	}
	function getCheckedRadioLabel(name) {
		var checked = form.querySelector('input[name="' + name + '"]:checked');
		if (!checked) return '（未選択）';
		var wrapper = checked.closest('.wpcf7-list-item');
		return wrapper ? wrapper.textContent.trim() : checked.value;
	}
	function getSelectText(name) {
		var select = form.querySelector('select[name="' + name + '"]');
		if (!select || select.selectedIndex < 0) return '';
		return select.options[select.selectedIndex].text;
	}
	function getFieldValue(name) {
		var field = form.querySelector('[name="' + name + '"]');
		return field ? field.value.trim() : '';
	}
	function setField(key, value) {
		var target = document.querySelector('[data-confirm="' + key + '"]');
		if (target) target.textContent = value;
	}
	function validateEmailMatch() {
		if (!emailField || !emailConfirm) return true;
		var ok = emailField.value.trim() === emailConfirm.value.trim();
		emailConfirm.classList.toggle('wpcf7-not-valid', !ok);
		if (emailMismatch) emailMismatch.hidden = ok;
		return ok;
	}
	emailConfirm && emailConfirm.addEventListener('blur', validateEmailMatch);

	function fillConfirmScreen() {
		setField('bukken-type', getCheckedRadioLabel('bukken-type'));
		if (madoriWrap && !madoriWrap.hidden) {
			setField('madori', getSelectText('madori-rooms') + '部屋 / ' + getSelectText('madori-type'));
		} else {
			setField('madori', '（対象外）');
		}
		var menseki = getFieldValue('menseki');
		setField('menseki', menseki ? menseki + ' ' + getCheckedRadioLabel('menseki-unit') : '');
		setField('chikunen', getSelectText('chikunen'));
		var addr = [getSelectText('pref'), getFieldValue('city'), getFieldValue('town'), getFieldValue('chome'), getFieldValue('building-name')].filter(Boolean).join(' ');
		setField('address-full', addr);
		setField('genkyo', getCheckedRadioLabel('genkyo'));
		setField('sale-timing', getSelectText('sale-timing'));
		setField('assessment-method', getCheckedRadioLabel('assessment-method'));
		setField('other-request', getFieldValue('other-request') || '（なし）');
		setField('your-name', getFieldValue('your-name'));
		setField('your-furigana', getFieldValue('your-furigana'));
		setField('your-tel', getFieldValue('your-tel'));
		setField('your-email', getFieldValue('your-email'));
		setField('your-zip', getFieldValue('your-zip'));
		setField('your-address', getFieldValue('your-address'));
		setField('how-know', getCheckedRadioLabel('how-know'));
		setField('question', getFieldValue('question') || '（なし）');
	}

	btnToConfirm && btnToConfirm.addEventListener('click', function () {
		if (!form.checkValidity()) { form.reportValidity(); return; }
		if (!validateEmailMatch()) {
			emailConfirm.focus();
			emailConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
			return;
		}
		fillConfirmScreen();
		stepInput.hidden = true;
		stepConfirm.hidden = false;
		setActiveStep(2);
		window.scrollTo({ top: form.offsetTop - 40, behavior: 'smooth' });
	});

	btnBack && btnBack.addEventListener('click', function () {
		stepConfirm.hidden = true;
		stepInput.hidden = false;
		setActiveStep(1);
		window.scrollTo({ top: form.offsetTop - 40, behavior: 'smooth' });
	});

	form.addEventListener('wpcf7invalid', function () {
		stepConfirm.hidden = true;
		stepInput.hidden = false;
		setActiveStep(1);
	});
	form.addEventListener('wpcf7mailsent', function () {
		stepInput.hidden = true;
		stepConfirm.hidden = true;
		stepComplete.hidden = false;
		setActiveStep(3);
		window.scrollTo({ top: form.offsetTop - 40, behavior: 'smooth' });
	});
});
