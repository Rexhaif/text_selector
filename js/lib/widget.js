var widgets = require("@jupyter-widgets/base");
var _ = require("lodash");

var TSWidgetModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "TSWidgetModel",
    _view_name: "TSWidgetView",
    _model_module: "text_selector",
    _view_module: "text_selector",
    _model_module_version: "2.0.3",
    _view_module_version: "2.0.3",
    widget_id: -1,
    tags: [],
    txt: '',
    colors: [],
    res: []
  })
});

var TSWidgetView = widgets.DOMWidgetView.extend({
  render() {
    this.widget_id = this.model.get('widget_id');
    this.tags = this.model.get("tags");
    this.txt = this.model.get("txt");
    this.colors = this.model.get("colors");
    this.res = this.model.get("res");

    this.selected_tag_id = 0;
    this.old_res = [];
    this.dis = true;

    this.box = document.createElement("div");
    this.box.id = `TSW-widget-${this.widget_id}`;
    this.box.style.border = "1px solid black";
    this.box.style.padding = "1%";

    this.box.appendChild(this.create_controls());
    this.box.appendChild(this.create_txt());
    this.el.appendChild(this.box);
  },
  create_txt() {
    let dom_txt = document.createElement("div");
    dom_txt.id = `TSW-widget-${this.widget_id}-txt`;
    dom_txt.style.border = "1px solid gray";
    dom_txt.style.margin = "1% 0";
    for (let i = 0; i < this.txt.length; i++) {
      let tmp = document.createElement("span");
      tmp.innerText = this.txt.charAt(i);
      tmp.id = `TSW-widget-${this.widget_id}-letter-${i}`;
      dom_txt.appendChild(tmp);
    }
    for(r of this.res){
      for(let i = r['start']; i<= r['end']; i++) {
        let letter = dom_txt.querySelector(`#TSW-widget-${this.widget_id}-letter-${i}`);
        letter.style.background = this.colors[this.tags.indexOf(r['tag'])];
      }
    }
    return dom_txt;
  },
  create_controls() {
    let dom_controls = document.createElement("div");
    dom_controls.id = `TSW-widget-${this.widget_id}-controls`;
    dom_controls.style.display = "inline";

    let add = document.createElement("button");
    add.id = `TSW-widget-${this.widget_id}-add`;
    add.innerText = "Add";
    add.classList.add('btn');
    add.onclick = () => {
      // console.log(this.selected_tag_id);
      let selection = window.getSelection();
      let selected_id;
      try {
        selected_id = selection.anchorNode.parentNode.id.replace('TSW-widget-', '').replace('-letter-\d+', '');
        selected_id = parseInt(selected_id, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (selected_id !== this.widget_id) return 
      let start, end, left, right;
      try {
        start = selection.anchorNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        start = parseInt(start, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      try {
        end = selection.focusNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        end = parseInt(end, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (start < end) {
        left = start;
        right = end;
      } else {
        left = end;
        right = start;
      }
      let l_txt = document.getElementById(`TSW-widget-${this.widget_id}-letter-${left}`).innerText;
      if (l_txt === ' ') left += 1;
      let r_txt = document.getElementById(`TSW-widget-${this.widget_id}-letter-${right}`).innerText;
      if (r_txt === ' ') right -= 1;

      for (let i = left; i <= right; i++) {
        let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
        tmp_el.style.background = this.colors[this.selected_tag_id];
      }
      this.res.push({
        start: left,
        end: right,
        tag: this.tags[this.selected_tag_id]
      });
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    dom_controls.appendChild(add);

    select = document.createElement("select");
    select.id = `TSW-widget-${this.widget_id}-select`;
    select.onchange = () => {
      selected = document.getElementById(`TSW-widget-${this.widget_id}-select`)[document.getElementById(`TSW-widget-${this.widget_id}-select`).selectedIndex].value;
      this.selected_tag_id = selected;
    };
    this.tags.forEach((item, idx) => {
      let tag_dom_el;
      tag_dom_el = document.createElement("option");
      tag_dom_el.innerText = item;
      tag_dom_el.value = idx;
      tag_dom_el.onclick = () => {
        this.selected_tag_id = idx;
      }
      select.appendChild(tag_dom_el);
    });
    dom_controls.appendChild(select);


    let rem = document.createElement("button");
    rem.id = `TSW-widget-${this.widget_id}-rem`;
    rem.innerText = "Remove";
    rem.classList.add('btn');
    rem.onclick = () => {
      let selection = window.getSelection();
      let selected_id;
      try {
        selected_id = selection.anchorNode.parentNode.id.replace('TSW-widget-', '').replace('-letter-\d+', '');
        selected_id = parseInt(selected_id, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (selected_id !== this.widget_id) return 
      let start, end, left, right;
      try {
        start = selection.anchorNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        start = parseInt(start, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      try {
        end = selection.focusNode.parentNode.id.replace(/TSW-widget-\d+-letter-/i, "");
        end = parseInt(end, 10);
      } catch(e) {
        console.log('error in parsing selection ', e)
        return
      }
      if (start < end) {
        left = start;
        right = end;
      } else {
        left = end;
        right = start;
      }
      this.res.forEach((r, idx) => {
        if ((r.start >= left) && (r.end <= right)) {
          for (let i = r.start; i <= r.end; i++) {
            let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
            tmp_el.style.background = '';
          }
          this.res.splice(idx, 1);
        }
      });
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    dom_controls.appendChild(rem);

    let res = document.createElement("button");
    res.id = 'TSW-res'
    res.classList.add('btn');
    res.innerText = "Reset";
    res.onclick = () => {
      for (r of this.res) {
        for(let i = r['start']; i<= r['end']; i++) {
          let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
          tmp_el.style.background = '';
        }
      }
      this.res = [];
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    dom_controls.appendChild(res);

    let done_inp = document.createElement("input");
    done_inp.id = "TSW-done";
    done_inp.type = "checkbox";
    done_inp.name = "Done";
    done_inp.value = "Done";
    done_inp.onclick = () => {
      this.dis = !this.dis;
      if (this.dis) {
        add.removeAttribute("disabled");
        rem.removeAttribute("disabled");
        res.removeAttribute("disabled");
        sel = document.getElementById(`TSW-widget-${this.widget_id}-select`);
        sel.removeAttribute("disabled");
        this.res = this.old_res;
        for (r of this.res) {
          for(let i = r['start']; i<= r['end']; i++) {
            let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
            tmp_el.style.background = this.colors[this.tags.indexOf(r.tag)];
          }
        }
      } else {
        add.disabled = "disabled";
        rem.disabled = "disabled";
        res.disabled = "disabled";
        sel = document.getElementById(`TSW-widget-${this.widget_id}-select`);
        sel.disabled = "disabled";
        this.old_res = this.res;
        for (r of this.res) {
          for(let i = r['start']; i<= r['end']; i++) {
            let tmp_el = document.getElementById(`TSW-widget-${this.widget_id}-letter-${i}`);
            tmp_el.style.background = '';
          }
        }
        this.res = [ "None" ];
      }
      this.model.set("res", this.res);
      this.model.save();
      this.model.save_changes();
    };
    let done = document.createElement("span");
    done.appendChild(done_inp);
    done.appendChild(document.createTextNode("Done"));
    dom_controls.appendChild(done);

    return dom_controls;
  },
});

module.exports = {
  TSWidgetModel,
  TSWidgetView
};
