        // websocket으로 서버와 http 포트 연결. http포트와 공유해서 통신할 수 있음
         // wesocket객체는 기본적으로 브라우저에서 지원
         window.onload = function(){
            document.getElementById('sendclick').onclick = function(){
            var messageV = document.getElementById('messageToSend').value;
            var DeviceID = document.getElementById('myid').value;

            if(messageV != ''){
               var alpha = "Message/" + DeviceID + "/" +messageV

               webSocket.send(alpha); // 서버로부터 메세지 받으면 바로 서버로 메세지 보냄
               document.getElementById('sending').textContent = messageV
            }
            else{
               document.getElementById('sending').textContent = "나 메시지인데 너 아무것도 입력 안했다"
            }

         }
         }

         const webSocket = new WebSocket("ws://localhost:8005");

         // 서버에서 wss.on('connection' 이 성공적으로 되면, 이벤트 실행
         webSocket.onopen = function () {
            console.log('서버와 웹소켓 연결 성공!');
            document.getElementById('connecting').textContent = "연결에 성공하였습니다."
         };

         // 사실상 .onmessage 와 .send 로 메세지 통신을 하게 되는 것이다 슬픈 것이다
         webSocket.onmessage = function (event) {
            console.log(event.data);

            var incomming = event.data.toString()
            var words = incomming.split(',')

            if(words[0] == "Alive"){
               document.getElementById('clientList').innerHTML = ""

               words.forEach(element => {
                  document.getElementById('clientList').innerHTML += element.toString()
                  document.getElementById('clientList').innerHTML += "\n"
               });
               
            }else if(words[0] == "Message"){
               document.getElementById('detectlog').innerHTML = ""

               words.forEach(element => {
                  document.getElementById('detectlog').innerHTML += element.toString()
                  document.getElementById('detectlog').innerHTML += "\n"
               });
            }else{
               document.getElementById('touching').textContent = "값을 받았습니다."
               document.getElementById('incomming').textContent = event.data.toString()
            }

         };

         webSocket.interval = setInterval(() => {
         //! 웹소켓은 비동기이기 때문에 삑 날 수 있어, 웹소켓이 클라이언트랑 연결이 되었는지 검사하는 안전 장치
         if (webSocket.readyState !== webSocket.OPEN) {
            return;
         }

         var AliveID = document.getElementById('myid').value;

         var SendText = "Alive/"+AliveID

         webSocket.send(SendText);
      }, 5000);