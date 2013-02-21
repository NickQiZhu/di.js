$(function () {
    var ctx = di.createContext();

    var Todo = Backbone.Model.extend({
        defaults: function () {
            return {
                title: "empty todo...",
                order: ctx.get("todos").nextOrder(),
                done: false
            };
        },

        initialize: function () {
            if (!this.get("title")) {
                this.set({"title": this.defaults().title});
            }
        },

        toggle: function () {
            this.save({done: !this.get("done")});
        }

    });

    var TodoList = Backbone.Collection.extend({

        model: Todo,

        localStorage: new Backbone.LocalStorage("todos-backbone"),

        done: function () {
            return this.filter(function (todo) {
                return todo.get('done');
            });
        },

        remaining: function () {
            return this.without.apply(this, this.done());
        },

        nextOrder: function () {
            if (!this.length) return 1;
            return this.last().get('order') + 1;
        },

        comparator: function (todo) {
            return todo.get('order');
        }

    });

    var TodoView = Backbone.View.extend({

        tagName: "li",

        template: _.template($('#item-template').html()),

        events: {
            "click .toggle": "toggleDone",
            "dblclick .view": "edit",
            "click a.destroy": "clear",
            "keypress .edit": "updateOnEnter",
            "blur .edit": "close"
        },

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$el.toggleClass('done', this.model.get('done'));
            this.input = this.$('.edit');
            return this;
        },

        toggleDone: function () {
            this.model.toggle();
        },

        edit: function () {
            this.$el.addClass("editing");
            this.input.focus();
        },

        close: function () {
            var value = this.input.val();
            if (!value) {
                this.clear();
            } else {
                this.model.save({title: value});
                this.$el.removeClass("editing");
            }
        },

        updateOnEnter: function (e) {
            if (e.keyCode == 13) this.close();
        },

        clear: function () {
            this.model.destroy();
        }

    });

    var AppView = Backbone.View.extend({
        dependencies: "todos",

        el: $("#todoapp"),

        statsTemplate: _.template($('#stats-template').html()),

        events: {
            "keypress #new-todo": "createOnEnter",
            "click #clear-completed": "clearCompleted",
            "click #toggle-all": "toggleAllComplete"
        },

        initialize: function () {

            this.input = this.$("#new-todo");
            this.allCheckbox = this.$("#toggle-all")[0];

            this.footer = this.$('footer');
            this.main = $('#main');
        },

        ready: function () {
            this.listenTo(this.todos, 'add', this.addOne);
            this.listenTo(this.todos, 'reset', this.addAll);
            this.listenTo(this.todos, 'all', this.render);

            this.todos.fetch();
        },

        render: function () {
            var done = this.todos.done().length;
            var remaining = this.todos.remaining().length;

            if (this.todos.length) {
                this.main.show();
                this.footer.show();
                this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
            } else {
                this.main.hide();
                this.footer.hide();
            }

            this.allCheckbox.checked = !remaining;
        },

        addOne: function (todo) {
            var view = new TodoView({model: todo});
            this.$("#todo-list").append(view.render().el);
        },

        addAll: function () {
            this.todos.each(this.addOne, this);
        },

        createOnEnter: function (e) {
            if (e.keyCode != 13) return;
            if (!this.input.val()) return;

            this.todos.create({title: this.input.val()});
            this.input.val('');
        },

        clearCompleted: function () {
            _.invoke(this.todos.done(), 'destroy');
            return false;
        },

        toggleAllComplete: function () {
            var done = this.allCheckbox.checked;
            this.todos.each(function (todo) {
                todo.save({'done': done});
            });
        }

    });

    ctx.register("todos", TodoList);
    ctx.register("app", AppView);

    ctx.initialize();
});
