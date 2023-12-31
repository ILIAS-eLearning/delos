var ilKprimChoiceWizardInputTemplate = {

	tag_container: 'tbody.kcwzd',
	tag_row: 'tr.kcwzd',
	tag_button: 'kprimchoice',

	getRowFromEvent: function(e) {
		return $(e.target).closest(this.tag_row);
	},

	getContainerFromEvent: function(e) {
		return $(e.target).closest(this.tag_container);
	},

	reindexRows: function(tbody) {
		var that = this;
		var rowindex = 0;

		// Special handling for radio buttons
		$(tbody).find(this.tag_row).each(function() {
			$(this).find('input:radio[name*="[correctness]"]').each(function() {
				$(this).data("checked", $(this).prop("checked"));
			});
		});

		// process all rows
		$(tbody).find(this.tag_row).each(function() {

			// correctness
			$(this).find('input:radio[name*="[correctness]"]').each(function() {
				that.handleId(this, 'name', rowindex);
				that.handleRadioOptionName(this, 'id', rowindex);
			});

			// answers input field
			$(this).find('input:text[id*="[answer]"]').each(function() {
				that.handleId(this, 'name', rowindex);
				that.handleId(this, 'id', rowindex);
			});
			$(this).find('textarea[id*="[answer]"]').each(function() {
				that.handleId(this, 'name', rowindex);
				that.handleId(this, 'id', rowindex);
			});

			// fileupload
			$(this).find('input:file[id*="[image]"]').each(function() {
				that.handleId(this, 'id', rowindex);
				that.handleId(this, 'name', rowindex);
			});
			// hidden file
			$(this).find('input:hidden[name*="[imagename]"]').each(function() {
				that.handleId(this, 'name', rowindex);
			});

			// submit upload
			$(this).find('input:submit[name*="[uploadImage]"]').each(function() {
				that.handleId(this, 'name', rowindex);
			});

			// delete image button
			$(this).find('input:submit[name*="[removeImage]"]').each(function() {
				that.handleId(this, 'name', rowindex);
			});

			// button
			$(this).find('div.btn.btn-link').each(function() {
				that.handleId(this, 'id', rowindex);
			});

			rowindex++;
		});

		// Special handling for radio buttons
		$(tbody).find(this.tag_row).each(function() {
			$(this).find('input:radio[name*="[correctness]"]').each(function() {
				$(this).prop("checked", $(this).data("checked"));
			});
		});
	},

	initEvents: function(rootel) {
		var that = this;

		if (typeof tinyMCE == 'undefined' || $(rootel).closest('table').find('textarea').size() == 0) {
			$(rootel).find('div.' + this.tag_button + '_up .glyph').click(function(e) {
				that.moveRowUp(e);
			});
			$(rootel).find('div.' + this.tag_button + '_down .glyph').click(function(e) {
				that.moveRowDown(e);
			});
		} else {
			$(rootel).find('div.' + this.tag_button + '_up .glyph').click((e) => {
				that.onClickHandler('up', e);
			});
			$(rootel).find('div.' + this.tag_button + '_down .glyph').click((e) => {
				that.onClickHandler('down', e);
			});
		}
	},

	handleRadioOptionName: function(el, attr, new_idx) {
		var parts = $(el).attr(attr).split('[');
		var lastPart = parts.pop();
		parts.pop();
		parts.push(new_idx + ']');
		parts.push(lastPart);
		$(el).attr(attr, parts.join('['));
	}
};

$(document).ready(function() {
	var ilKprimChoiceWizardInput = $.extend({}, AnswerWizardInput, ilKprimChoiceWizardInputTemplate);
	ilKprimChoiceWizardInput.init();
});