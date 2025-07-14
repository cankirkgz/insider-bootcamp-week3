const studentData = [
    {
        name: "Can",
        age: 20,
        gender: "erkek"
    },
    {
        name: "Ayşe",
        age: 21,
        gender: "kadın"
    },
    {
        name: "Ahmet",
        age: 22,
        gender: "erkek"
    },
    {
        name: "Mehmet",
        age: 21,
        gender: "erkek"
    },
    {
        name: "Zeynep",
        age: 20,
        gender: "kadın"
    }
];

$(document).ready(function() {
    renderTable();

    $("#addStudent").click(function() {
        const name = $("#name").val().trim();
        const age = $("#age").val().trim();
        const gender = $("#gender").val().trim();

        if(name && age && gender) {
            studentData.push({name: name, age: age, gender: gender});
            renderTable();
            $("#name, #age, #gender").val("");
        }
    });
});

function renderTable() {
    const tbody = $("tbody");
    tbody.empty();

    studentData.forEach((student, index) => {
        const row = $(`
            <tr>
                <td>${student.name}</td>
                <td>${student.age}</td>
                <td>${student.gender}</td>
                <td><button class="delete-btn" data-index="${index}">Sil</button></td>
            </tr>
            `);

            row.mousemove(function () {
                $(this).css('background-color', '#f1f1f1');
            });
          
            row.mouseout(function () {
                $(this).css('background-color', 'white');
            });
          
            row.click(function () {
                $(this).toggleClass('clicked');
            });
        
            row.find('.delete-btn').click(function(e) {
                e.stopPropagation();
                studentData.splice(index, 1);
                renderTable();
            });

            tbody.append(row);
    });
}
