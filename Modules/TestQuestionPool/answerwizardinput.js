var AnswerWizardInput = {
	init: function () {
		this.initEvents($(this.tag_container));
	},

	initEvents: function (rootel) {
		var that = this;
		$(rootel).find('div.' + this.tag_button + '_add .glyph').click((e) => {
			that.addRow(e);
		});
		$(rootel).find('div.' + this.tag_button + '_remove .glyph').click((e) => {
			that.removeRow(e);
		});
		$(rootel).find('div.' + this.tag_button + '_up .glyph').click((e) => {
			that.moveRowUp(e);
		});
		$(rootel).find('div.' + this.tag_button + '_down .glyph').click((e) => {
			that.moveRowDown(e);
		});
	},

    onClickHandler: function (action, e) {
        e.preventDefault();
        const id_tag = e.currentTarget.parentNode.id.split('[');
        const id = id_tag.pop().slice(0, -1);
        const target = id_tag[0].split('_').pop();
        let button = document.createElement('BUTTON');
        button.type = 'submit';
        button.name = 'cmd[' + action + target  + '][' + id + ']';
        button.style.display = 'none';
        e.target.insertAdjacentElement('afterend', button);
        button.form.requestSubmit(button);
    },

	addRow: function (e) {
		// clone row
		var source = this.getRowFromEvent(e);
		var target = $(source).clone();

		// add events
		this.initEvents(target);

		// empty inputs
		this.cleanRow(target);

		$(source).after(target);

		this.reindexRows(this.getContainerFromEvent(e));

		il.Form.registerFileUploadInputEventTrigger();

		let current_upload_fields = $("#files").children().length;
		let max_upload_fields = parseInt(source.children(".imagewizard_add").attr("data-val"));
		if(current_upload_fields === max_upload_fields) {
			$(".imagewizard_add").hide();
		}
	},

	removeRow: function (e) {
		var source = this.getRowFromEvent(e);
		var tbody = this.getContainerFromEvent(e);

		// do not remove last row
		if($(tbody).find(this.tag_row).size() > 1) {
			$(source).remove();
		}
		// reset last remaining row
		else {
			this.cleanRow(source);
		}

		this.reindexRows(tbody);

		let current_upload_fields = $("#files").children().length;
		let max_upload_fields = parseInt(source.children(".imagewizard_remove").attr("data-val"));
		if(current_upload_fields <= max_upload_fields) {
			$(".imagewizard_add").show();
		}
	},

	moveRowUp: function (e) {
		var source = this.getRowFromEvent(e);
		var prev = $(source).prev();
		if(prev[0])
		{
			$(prev).before(source);

			this.reindexRows(this.getContainerFromEvent(e));
		}
	},

	moveRowDown: function (e) {
		var source = this.getRowFromEvent(e);
		var next = $(source).next();
		if(next[0])
		{
			$(next).after(source);

			this.reindexRows(this.getContainerFromEvent(e));
		}
	},

	handleId: function (el, attr, new_idx) {
		var parts = $(el).attr(attr).split('[');
		parts.pop();
		parts.push(new_idx + ']');
		$(el).attr(attr, parts.join('['));
	}
};