const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();//экспресс-приложение
app.use(express.json());//парсер для работы с json
app.use(cors());//обход кросдоменных блокировок

const users = JSON.parse(fs.readFileSync("users.json"));//пользователи из файла

//получение всех пользователей
app.get("/api/users", (request, response) => {
    response.send(users);
})

//получение пользователя по id
app.get("/api/users/:id", (request, response) => {
    const id = request.params.id;
    //находим пользователя по Id
    let user = users.find(u => u.id === parseInt(id));
    //если нашли - отправляем клиенту
    if(user != null) {
        response.send(user);
    }
    else {
        response.status(404).send();
    }
})

//добавление пользователя
app.post("/api/users", (request, response) => {
    if(!request.body) {
        return response.status(400).send();
    }

    const userName = request.body.name;//извлекаем данные из тела запроса
    const userAge = request.body.age;
    const userImage = request.body.image;

    let newUser = {name: userName, age: userAge, image: userImage};//создаем нового пользователя на основе извлеченных данных
    const id = Math.max.apply(Math, users.map(u => u.id));//получаем максимальный id на данный момент
    newUser.id = id + 1;//записываем новому пользователю id
    users.push(newUser);//добавляем в массив 

    let data = JSON.stringify(users);//преобразуем массив в json для записи в файл
    fs.writeFileSync("users.json", data);//записываем измененные данные в файл
    response.send(newUser);
})

//изменение пользователя
app.put("/api/users", (request, response) => {
    if(!request.body) return response.sendStatus(400);

    const userId = request.body.id;
    const userName = request.body.name;//извлекаем данные из тела запроса
    const userAge = request.body.age;
    const userImage = request.body.image;

    const user = users.find(u => u.id === parseInt(userId));
    //если в базе пользователь найден - перезаписываем значения свойств переданными
    if(user) {
        user.name = userName;
        user.age = userAge;
        user.image = userImage;
        let data = JSON.stringify(users);//преобразуем массив в json для записи в файл
        fs.writeFileSync("users.json", data);//записываем измененные данные в файл
        response.send(user);
    }
    else {
        response.status(404).send();
    }
})

//удаление пользователя
app.delete("/api/users/:id", (request, response) => {
    const id = request.params.id;
    const userIndex = users.findIndex(u => u.id == parseInt(id));
    //если пользователь найден(индекс в пределах массива)
    if(userIndex > -1) {
        //удаляем из массива найденный элемент(пользователя)
        const user = users.splice(userIndex, 1);
        let data = JSON.stringify(users);//преобразуем массив в json для записи в файл
        fs.writeFileSync("users.json", data);//записываем измененные данные в файл
        response.send(user);
    }
    else {
        response.status(404).send();
    }
})

app.listen(5000, () => console.log("Сервер запущен по адресу: http://localhost:5000"));
