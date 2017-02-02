$(document).ready(function() {
    var listo = [];

    $("#newTaskForm").hide();

    $('#add-todo').on('click', function() {
        $('#newTaskForm').fadeToggle('fast', 'linear');
    });

    //closes form
    $('#cancel').on('click', function(e) {
        e.preventDefault();
        $('#newTaskForm').fadeToggle('fast', 'linear');
    });

    var Task = function(task) {
        this.task = task;
        this.id = 'new';
    }

    function addTaskToDOM(listid, task) {
        $(listid).append(
            '<a href="#finish" class="" id="item">' +
            '<li class="list-group-item">' +
            '<h3>' + task.task + '</h3>' +
            '<span class="arrow pull-right">' +
            '<i class="glyphicon glyphicon-arrow-right">' +
            '</span>' +
            '</li>' +
            '</a>'
        );
    }

    var addTask = function(task) {
        if (task) {
            task = new Task(task);
            listo.push(task);

            $('#newItemInput').val('');

            addTaskToDOM('#newList', task);
        }

        $('#newTaskForm').fadeToggle('fast', 'linear');
    }

    $('#saveNewItem').on('click', function(e) {
        e.preventDefault();
        var task = $('#newItemInput').val().trim();
        addTask(task);
        populateStorage();
    });

    var advanceTask = function(task) {
        var modifiedTask = task.innerText.trim()
        for (var i = 0; i < listo.length; i++) {
            if (listo[i].task === modifiedTask) {
                if (listo[i].id === 'new') {
                    listo[i].id = 'inProgress';
                } else if (listo[i].id === 'inProgress') {
                    listo[i].id = 'archived';
                } else {
                    listo.splice(i, 1);
                }
                break;
            }
        }
        task.remove();
        populateStorage();
    };

    $(document).on('click', '#item', function(e) {
        e.preventDefault();
        var task = this;
        advanceTask(task);
        this.id = "inProgress";
        $("#currentList").append(this.outerHTML);
    });

    $(document).on('click', '#inProgress', function(e) {
        e.preventDefault();
        var task = this;
        task.id = "archived";
        var changeIcon = task.outerHTML.replace('glyphicon-arrow-right', 'glyphicon-remove');
        advanceTask(task);
        $('#archivedList').append(changeIcon);
    });

    $(document).on('click', '#archived', function(e) {
        e.preventDefault();
        var task = this;
        advanceTask(task);
    });


    if (Modernizr.localstorage) {
        // window.localStorage is available!
        if (!localStorage.getItem('listo')) {
            populateStorage();
        } else {
            loadData();
        }
    } else {
        // no native support for HTML5 storage :(
        // maybe try dojox.storage or a third-party solution
        alert("local storage not found");
    }

    function populateStorage() {
        var JSONReadyTasks = JSON.stringify(listo);
        localStorage.setItem("listo", JSONReadyTasks);
    }

    function loadData() {
        listo = JSON.parse(localStorage["listo"]);
        for(var i = 0; i < listo.length; i++) {
          var task = listo[i];
          var taskid = listo[i].id;
          if(taskid === "new") {
            addTaskToDOM('#newList', task);
          } else if(taskid === "inProgress") {
            addTaskToDOM('#currentList', task);
          } else if (taskid === "archived") {
            addTaskToDOM('#archivedList', task);
          }
        }
    }

}); //end ready
