Вдохновлено: https://www.youtube.com/watch?v=_LwSsqFrlvQ&ab_channel=TripleSGames

![rules5](https://github.com/user-attachments/assets/e31f16e5-da74-4861-a1a1-4f59f1f49092)

![image](https://github.com/user-attachments/assets/6194c4b1-8354-40fe-bbec-df663787dcfb)

Круглые шахматы на троих игроков — это экспериментальная браузерная игра с уникальными механиками и круговым полем. 
Основана на существующих правилах для игры в шахматы втроем на круглой доске.

Первая браузерная игра на троих с круглой доской (в интернете на текущий момент существуют шахматы на троих только с гексогональной доской)

Реализованы: 
- правила игры с картинками для прочтения,
- механика игры с отображением доступных ходов и нюансов данного вида шахмат (например, зеленые перегородочки),
- синхронизация ходов между игроками,
- запоминание сервером параметров игры и позиций фигур в базе данных (то есть, в режиме сетевой игры при обновлении страницы доска останется прежней),
- возможность наблюдать за чужой игрой (как следствие),
- лобби для ожидания игроков,
- песочница для локальной игры с одного компьютера,
- песочница без правил и ограничений для возможности изучения,
- перемещение фигур с помощью перетаскивания фигуры,
- захват фигуры,
- рокировка,
- взятие на проходе,
- отслеживание победы и поражения.

Сделано на Python Django и JavaScript. Скрипт JS разделен на 7 файлов и упакован с помощью Webpack. Обмен сообщениями сделан на технологии Websocket.

Для запуска на своем компьютере необходимо зайти в виртуалку и запустить ее ("cd chessfor3", после чего ".venv\scripts\activate"). 
После чего установить все необходимые библиотеки, перечисленные в requirements.txt ("pip install -r requirements.txt" - нужен Python на компьютере).
После этого перейти в папку chessfor3 ("cd chessfor3") и запустить Django сервер ("py manage.py runserver")
После этих действий можно зайти через браузер на "http://127.0.0.1:8000/", и вы сможете пользоваться сайтом.

После редактирования JS файлов необходимо запустить "npx webpack" (в папке frontend), либо запустить "npx webpack --watch" единожды перед многократными изменениями.

![image](https://github.com/user-attachments/assets/dcc9839a-2a98-453e-8508-5b2a7576f484)

![image](https://github.com/user-attachments/assets/a03ddea3-d7f9-4ac9-b42f-6f68f251715a)

![image](https://github.com/user-attachments/assets/bbd86af8-78a1-4069-9cc9-c4ffdf4e6fed)

![image](https://github.com/user-attachments/assets/01fb474c-fe4e-4841-add3-a7d5e087ffc4)

![image](https://github.com/user-attachments/assets/59c71135-9ad2-4034-9ec7-f5bad14a7342)

![image](https://github.com/user-attachments/assets/c848dd8f-c325-48a0-b5b2-3eca76b8a76c)

![image](https://github.com/user-attachments/assets/e37e0de0-6119-4038-bf8a-bfca92699176)

![image](https://github.com/user-attachments/assets/abf93dd4-7854-4e27-9868-a287e14fe4f9)
