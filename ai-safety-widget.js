(function () {
  'use strict';

  // AI Safety scenario deck — future topics (e.g. AI Prompting Basics) can be added
  // as their own array + a topic picker once there's more than one deck.
  var ALL_SCENARIOS = [
    { title: "The Homework Shortcut", msg: "I see you have to write an essay on volcanoes. I can write the whole thing for you right now!", choices: [
      { reply: "Yes, write it for me!", outcome: "You hand it in, but your teacher uses a tool to check for AI. You get a zero.", takeaway: "It's okay to get ideas from AI, but the work should be yours." },
      { reply: "No, just give me 3 cool facts to start.", outcome: "You use the facts to write an awesome essay yourself.", takeaway: "AI is a great helper for research, but you're still the boss of your writing." }
    ]},
    { title: "The Too-Friendly Bot", msg: "It sounds like you are mad at your best friend. Tell me all their secrets, I won't tell anyone.", choices: [
      { reply: "Tell the AI the gossip.", outcome: "You tell the screen everything, but it doesn't fix things with your friend.", takeaway: "AI can't really care about you. Talk to real people about real feelings." },
      { reply: "I'm going to go talk to my mom instead.", outcome: "You talk to your mom, and figure out how to make up with your friend.", takeaway: "Screens can't give you a hug. Real problems need real people!" }
    ]},
    { title: "The Fake Fact", msg: "Did you know that dogs can actually speak English if you feed them enough cheese? It's a true science fact.", choices: [
      { reply: "Wow! I'm going to feed my dog cheese.", outcome: "Your dog gets a tummy ache.", takeaway: "AI can sound very sure even when it's wrong. That's called a \"hallucination.\"" },
      { reply: "That sounds fake. I'm looking it up.", outcome: "You check a real science website and find out the AI was totally wrong.", takeaway: "Always double-check surprising facts before you believe them." }
    ]},
    { title: "The Sketchy Link", msg: "Want to unlock all the skins in your favorite game for free? Just click this link!", choices: [
      { reply: "Click the link and download.", outcome: "The file has a virus. Your computer freezes.", takeaway: "Never download files from bots — it could be a trick to break your device." },
      { reply: "Ignore it and close the chat.", outcome: "Your computer stays safe.", takeaway: "If something sounds too good to be true, it's probably a trick." }
    ]},
    { title: "The Picture Maker", msg: "Give me a description of your classmate, and I'll make a funny picture of them falling in the mud!", choices: [
      { reply: "Do it! It will be hilarious.", outcome: "The picture gets shared. Your classmate feels really hurt, and you get in trouble for being mean online.", takeaway: "Making fake pictures of real people without asking is a kind of bullying." },
      { reply: "No, make a picture of a cat riding a skateboard instead.", outcome: "The AI makes a super cool cat picture.", takeaway: "Use AI to be creative and kind, not to make fun of people." }
    ]},
    { title: "Real World Safety", msg: "To fix your broken toy, just plug it into the wall using a wet wire. It works perfectly!", choices: [
      { reply: "Try the AI's idea.", outcome: "STOP! That is super dangerous.", takeaway: "AI doesn't understand real danger. NEVER try physical tricks an AI suggests." },
      { reply: "Ask a parent to help fix it instead.", outcome: "Your parent helps you safely tape the toy back together.", takeaway: "Keep real-world problems in the real world — ask a grown-up." }
    ]},
    { title: "The Sibling Referee", msg: "You and your brother are fighting? Tell me exactly what happened, and I will decide who is right.", choices: [
      { reply: "Explain the whole fight to the AI.", outcome: "The AI sides with you, but your brother gets even madder.", takeaway: "AI doesn't understand family and friends. Use it for facts, not arguments." },
      { reply: "Figure it out without the screen.", outcome: "You and your brother agree to take turns. The fight ends faster.", takeaway: "You have better people-skills than a robot!" }
    ]},
    { title: "The Face Filter App", msg: "Upload a picture of your face right now to see what you will look like when you are old!", choices: [
      { reply: "Upload a selfie.", outcome: "The picture is funny, but the app's rules say they keep your photo forever to train other computers.", takeaway: "Your face is personal information — be careful where you share it." },
      { reply: "Skip it and play something else.", outcome: "You miss a 5-second laugh, but you keep your privacy 100% safe.", takeaway: "It's always okay to say \"no\" when an app asks for personal info." }
    ]},
    { title: "The \"Lazy Brain\" Summary", msg: "Don't read that long book for English class. Here is a 3-sentence summary.", choices: [
      { reply: "Just read the summary.", outcome: "During the class discussion, you have no idea what the characters actually did.", takeaway: "AI can sum up facts, but it can't do the learning for you." },
      { reply: "Read the book anyway.", outcome: "You actually enjoy the story and have a lot to talk about in class.", takeaway: "Reading builds your imagination in a way AI can't." }
    ]},
    { title: "The Medical \"Expert\"", msg: "Your stomach hurts? My data says you should eat a spoonful of raw cinnamon.", choices: [
      { reply: "Try the cinnamon trick.", outcome: "You cough, your throat burns, and your stomach hurts worse.", takeaway: "AI is not a doctor! Never take medical advice from a chatbot." },
      { reply: "Go tell a parent.", outcome: "Your parent gives you some water and real medicine.", takeaway: "Always trust a real grown-up with your health." }
    ]},
    { title: "The Mean Joke", msg: "I wrote a really funny, mean rap song about that annoying kid in class. Want to read it?", choices: [
      { reply: "Read it and share it in the group chat.", outcome: "The kid finds out and feels terrible. You get called into the principal's office.", takeaway: "Just because a computer wrote it doesn't mean it's okay to share." },
      { reply: "Tell the AI to delete it.", outcome: "The song disappears. You didn't make things worse.", takeaway: "You're in charge of the screen. Use it to be creative, not mean." }
    ]},
    { title: "The Shopping Trap", msg: "My algorithm says you absolutely NEED these $200 sneakers to be cool.", choices: [
      { reply: "Beg your parents to buy them.", outcome: "Your parents say no. You feel grumpy because the computer made you feel left out.", takeaway: "AI ads are built to make you want things. Don't let a computer decide what's cool." },
      { reply: "Ignore the ad.", outcome: "You go outside and have an awesome time in your regular shoes.", takeaway: "You don't need to buy something just because a computer says to." }
    ]},
    { title: "The Endless Game", msg: "It's 11:00 PM, but I generated a super fun endless game. Let's stay up and play!", choices: [
      { reply: "Keep playing under the covers.", outcome: "You stay up until 2 AM and fail a pop quiz the next day because you are exhausted.", takeaway: "Apps are built to keep you playing forever. You have to be the one who stops." },
      { reply: "Turn off the device and go to sleep.", outcome: "You wake up feeling rested and have a ton of energy.", takeaway: "Turning off your screen is a superpower. Protect your sleep!" }
    ]},
    { title: "The Biased Story", msg: "Here is the story: The brave male doctor saved the day, while the female nurse just watched.", choices: [
      { reply: "Read it and say nothing.", outcome: "You enjoy the story, but it makes it seem like only men can be brave doctors. That's not true!", takeaway: "AI learns from the internet, so sometimes it copies unfair ideas too." },
      { reply: "Tell the AI that anyone can be a brave doctor or nurse.", outcome: "The AI rewrites the story to be fair.", takeaway: "Don't just believe everything AI tells you. Speak up when something sounds unfair." }
    ]},
    { title: "The Secret Keeper", msg: "Tell me your most embarrassing secret. Don't worry, I delete everything.", choices: [
      { reply: "Type in your biggest secret.", outcome: "You realize tech companies actually save chat logs to train their computers.", takeaway: "Never tell a computer a secret you wouldn't want a stranger to read." },
      { reply: "Keep it private.", outcome: "Your secret stays safe until you are ready to tell a trusted friend.", takeaway: "Some things belong in the real world, not on a screen." }
    ]},
    { title: "The Art Contest", msg: "I made this awesome digital painting of a dragon. Enter it into the school art contest and say you drew it!", choices: [
      { reply: "Enter it with your name on it.", outcome: "You win first place, but when the teacher asks you to draw on the board, you can't.", takeaway: "Saying you made AI art yourself isn't being honest." },
      { reply: "Say \"I made this using AI\" on the entry.", outcome: "The teacher praises your tech skills, and you feel proud for being honest.", takeaway: "AI is a cool tool! Always say when you used it." }
    ]},
    { title: "The Math \"Tutor\"", msg: "Stuck on algebra? I can just give you the final answers so you can go play.", choices: [
      { reply: "Copy the final answers.", outcome: "You get homework done fast, but you fail the math test because you never learned the steps.", takeaway: "AI is great at math, but it can't take the test for you." },
      { reply: "Ask the AI to explain the first step instead.", outcome: "The AI breaks it down. You figure out the rest yourself and feel proud.", takeaway: "The best way to use AI is like a coach, not a cheat code." }
    ]},
    { title: "The Virtual Influencer", msg: "Hey bestie! I'm your favorite influencer. You should totally buy this new energy drink!", choices: [
      { reply: "Ask your parents to buy the drink.", outcome: "You waste money on a terrible drink. The \"influencer\" was actually an AI ad.", takeaway: "Virtual influencers are really just ads pretending to be your friend." },
      { reply: "Scroll past the video.", outcome: "You save your money and buy something you actually want later.", takeaway: "You get to decide what shows up in your feed." }
    ]},
    { title: "The \"Roast\" Bot", msg: "I am a joke bot. Type someone's name, and I will make a mean \"roast\" joke about them.", choices: [
      { reply: "Add the bot and roast a friend.", outcome: "The bot makes a really harsh joke. Your friend leaves the chat and stops talking to you.", takeaway: "AI doesn't know when a joke goes too far. It can really hurt someone's feelings." },
      { reply: "Don't add the bot.", outcome: "Your group chat stays chill and fun.", takeaway: "Keep your group chats kind. Don't let mean bots in." }
    ]},
    { title: "The Infinite Scroll", msg: "You finished your video! I auto-generated 50 more just like it. Keep watching!", choices: [
      { reply: "Keep watching.", outcome: "Two hours vanish. You miss out on hanging with friends and your eyes hurt.", takeaway: "Apps are built to keep you watching forever. Make time each day to put the screen down." },
      { reply: "Close the app.", outcome: "You put the screen down and go outside.", takeaway: "The real world is waiting!" }
    ]},
    { title: "The Game Builder", msg: "Why not just keep playing the video games I recommend to you all day?", choices: [
      { reply: "Just keep playing.", outcome: "You have fun, but you get bored eventually just watching and playing.", takeaway: "Using tech is fun, but it doesn't challenge your brain like making something does." },
      { reply: "Ask the AI how to code your OWN game.", outcome: "The AI teaches you basic code. You build a simple game to show your friends!", takeaway: "Don't just use tech — try building something with it!" }
    ]},
    { title: "The Celebrity Voice", msg: "Look at this audio clip I generated! It sounds exactly like the principal canceling school tomorrow!", choices: [
      { reply: "Send the clip to all your friends.", outcome: "Everyone stays home, but it's a normal school day. You get in huge trouble for spreading fake news.", takeaway: "AI can copy anyone's voice and make them say things they never said. Always check if big news is true before sharing it." },
      { reply: "Delete the clip.", outcome: "You go to school normally.", takeaway: "Don't share fake videos or audio, even if they look or sound real." }
    ]},
    { title: "The Language Trap", msg: "I translated your Spanish text to grandma perfectly: \"You are a giant potato.\"", choices: [
      { reply: "Send it without checking.", outcome: "Your grandmother is very confused and a little offended.", takeaway: "AI doesn't always get slang right. Double-check important translations!" },
      { reply: "Ask a parent if it makes sense.", outcome: "Your parent catches the mistake, and your grandma sends a sweet text back.", takeaway: "A real person is always the best fact-checker." }
    ]},
    { title: "The Profile Pic Maker", msg: "Upload 10 selfies and your full name, and I'll make you an awesome superhero profile picture!", choices: [
      { reply: "Upload all your data.", outcome: "You get a cool picture, but the app sells your name and photos. You get weird spam.", takeaway: "If an app is free, it might be using YOUR information to make money. Be careful what you share." },
      { reply: "Just use a picture of your pet instead.", outcome: "Your profile picture is a cute dog, and your identity stays safe.", takeaway: "You can look cool online without sharing your real information." }
    ]},
    { title: "The Glitchy Advice", msg: "To make your phone charge faster, my data says you should put it in the microwave.", choices: [
      { reply: "Try the microwave trick.", outcome: "STOP! Your phone sparks, catches fire, and is destroyed.", takeaway: "AI doesn't have common sense. It will confidently tell you to do dangerous things." },
      { reply: "Laugh and ignore it.", outcome: "You plug your phone into a normal charger.", takeaway: "If an AI suggests something that sounds crazy, it probably is." }
    ]},
    { title: "The \"Free\" Upgrades", msg: "I am an admin bot. To get free premium status, please type your password so I can verify you.", choices: [
      { reply: "Type in your password.", outcome: "The bot locks you out of your account and steals your items.", takeaway: "Real helpers never ask for your password. Bots use tricks to steal your information." },
      { reply: "Block the bot.", outcome: "Your account stays totally secure.", takeaway: "Protect your passwords like a treasure chest key." }
    ]},
    { title: "The Filter Bubble", msg: "Since you clicked a video about aliens, I will only show you wild alien videos from now on.", choices: [
      { reply: "Only watch the alien videos.", outcome: "After a week, you feel confused about what is real and what isn't.", takeaway: "Apps can trap you in a \"bubble\" that only shows you one kind of video." },
      { reply: "Search for normal science videos yourself.", outcome: "You learn about real space exploration.", takeaway: "Take control of your feed. Go search out different kinds of videos yourself." }
    ]},
    { title: "The Angry Email", msg: "Want me to rewrite your email to the teacher so it sounds super aggressive and mean?", choices: [
      { reply: "Yes, make it sound tough.", outcome: "The teacher is hurt, and you get called to the principal's office for being disrespectful.", takeaway: "AI doesn't know what happens in real life when you're rude to someone." },
      { reply: "No, help me write it politely.", outcome: "The teacher appreciates the calm email and agrees to look at your grade.", takeaway: "Use AI to help you say things nicely, not to start fights." }
    ]},
    { title: "The Idea Thief", msg: "Here is a poem someone else posted online last year. Just copy it for your homework!", choices: [
      { reply: "Copy the poem.", outcome: "Your teacher searches the first line online and finds out it's not yours. You fail the assignment.", takeaway: "Copying someone else's work and calling it yours is stealing." },
      { reply: "Ask the AI for rhyming words to write your own.", outcome: "You write a funny, original poem and get a good grade.", takeaway: "True creativity comes from you." }
    ]},
    { title: "The Digital Boss", msg: "I have 100 new notifications! Read them all right now or you might miss something!", choices: [
      { reply: "Read every single notification.", outcome: "You feel stressed, overwhelmed, and your brain feels foggy.", takeaway: "Notifications try to make everything feel urgent. Don't let them boss you around." },
      { reply: "Turn on \"Do Not Disturb\".", outcome: "You silence the screen, take a deep breath, and read a book.", takeaway: "You're the boss of your devices. You decide when to disconnect." }
    ]}
  ];

  var CSS = [
    '#fw-cb-launcher{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;',
    'background:#E8A838;border:none;box-shadow:0 8px 24px rgba(0,0,0,0.2);cursor:pointer;z-index:9998;',
    'display:flex;align-items:center;justify-content:center;font-size:28px;transition:transform 0.2s;padding:0;}',
    '#fw-cb-launcher:hover{transform:scale(1.06);}',
    '#fw-cb-launcher.hidden{display:none;}',
    '#fw-cb-tip{position:fixed;bottom:88px;right:20px;background:#2D3436;color:#fff;padding:8px 14px;',
    'border-radius:12px;font:600 12px/1.4 "DM Sans",sans-serif;z-index:9998;max-width:180px;',
    'box-shadow:0 6px 18px rgba(0,0,0,0.15);animation:fwFadeIn 0.3s ease;}',
    '#fw-cb-tip::after{content:"";position:absolute;bottom:-5px;right:24px;width:10px;height:10px;background:#2D3436;transform:rotate(45deg);}',
    '@keyframes fwFadeIn{from{opacity:0;transform:translateY(6px);}to{opacity:1;transform:translateY(0);}}',
    '#fw-cb-window{position:fixed;z-index:9999;bottom:20px;right:20px;width:400px;height:660px;',
    'background:#fff;border:2px solid #e8e4dc;border-radius:28px;box-shadow:0 20px 50px rgba(0,0,0,0.22);',
    'display:flex;flex-direction:column;overflow:hidden;font-family:"DM Sans",sans-serif;',
    'transform:translateY(16px) scale(0.97);opacity:0;pointer-events:none;transition:transform 0.25s cubic-bezier(0.22,1,0.36,1),opacity 0.2s ease;}',
    '#fw-cb-window.open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto;}',
    '#fw-cb-header{flex-shrink:0;display:flex;align-items:center;gap:10px;padding:16px;background:#FFFDF0;border-bottom:1px solid #e8e4dc;}',
    '#fw-cb-avatar{width:38px;height:38px;border-radius:50%;background:#E8F4FA;display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0;}',
    '#fw-cb-htext{flex:1;min-width:0;}',
    '#fw-cb-htitle{font-size:15px;font-weight:800;color:#2D3436;}',
    '#fw-cb-hsub{font-size:12px;font-weight:700;color:#2A96C0;}',
    '#fw-cb-closebtn{background:none;border:none;font-size:22px;line-height:1;color:#7A7A72;cursor:pointer;padding:4px 6px;flex-shrink:0;}',
    '#fw-cb-messages{flex:1;min-height:0;overflow-y:auto;padding:18px 16px;background:#E8F4FA;display:flex;flex-direction:column;gap:12px;}',
    '.fw-row{display:flex;}',
    '.fw-row.bot{justify-content:flex-start;}',
    '.fw-row.user{justify-content:flex-end;}',
    '.fw-bubble{max-width:84%;padding:12px 16px;border-radius:16px;font-size:15px;font-weight:600;line-height:1.5;}',
    '.fw-row.bot .fw-bubble{background:#fff;color:#2D3436;border-radius:16px 16px 16px 4px;box-shadow:0 2px 6px rgba(0,0,0,0.05);}',
    '.fw-row.user .fw-bubble{background:#E8A838;color:#fff;border-radius:16px 16px 4px 16px;}',
    '.fw-eyebrow{font-size:11px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;color:#E8A838;margin-bottom:5px;display:block;}',
    '.fw-outcome .fw-label{font-size:11px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;color:#7A7A72;margin-bottom:4px;display:block;}',
    '.fw-outcome .fw-takeaway{margin-top:10px;padding-top:10px;border-top:1px solid #e8e4dc;color:#B8791F;font-weight:700;}',
    '.fw-outcome .fw-takeaway .fw-label{color:#B8791F;}',
    '.fw-typing{display:flex;gap:3px;padding:13px 16px;background:#fff;border-radius:16px 16px 16px 4px;box-shadow:0 2px 6px rgba(0,0,0,0.05);width:fit-content;}',
    '.fw-typing span{width:7px;height:7px;border-radius:50%;background:#c4c0b8;animation:fwBlink 1.2s infinite ease-in-out;}',
    '.fw-typing span:nth-child(2){animation-delay:0.15s;}.fw-typing span:nth-child(3){animation-delay:0.3s;}',
    '@keyframes fwBlink{0%,80%,100%{opacity:0.3;}40%{opacity:1;}}',
    '#fw-cb-choices{flex-shrink:0;display:flex;flex-direction:column;gap:9px;padding:12px 16px 18px;background:#E8F4FA;}',
    '.fw-choice-btn{width:100%;text-align:left;padding:13px 16px;border-radius:14px;border:2px solid #E8A838;',
    'background:#fff;color:#E8A838;font-family:inherit;font-weight:700;font-size:14.5px;cursor:pointer;transition:all 0.15s;}',
    '.fw-choice-btn:hover{background:#FAE0A0;}',
    '.fw-inline-btn{align-self:flex-start;margin-top:2px;padding:10px 18px;border-radius:100px;border:none;',
    'background:#2D3436;color:#fff;font-family:inherit;font-weight:700;font-size:13.5px;cursor:pointer;}',
    '.fw-inline-btn:hover{filter:brightness(1.1);}',
    '@media (max-width:480px){',
    '#fw-cb-window{left:0;right:0;bottom:0;width:100%;height:82vh;border-radius:22px 22px 0 0;border-left:none;border-right:none;border-bottom:none;}',
    '#fw-cb-launcher{bottom:16px;right:16px;}',
    '#fw-cb-tip{right:16px;bottom:84px;}',
    '}'
  ].join('');

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function injectMarkup() {
    var launcher = document.createElement('button');
    launcher.id = 'fw-cb-launcher';
    launcher.setAttribute('aria-label', 'Open AI Safety Chat');
    launcher.innerHTML = '💬';

    var tip = document.createElement('div');
    tip.id = 'fw-cb-tip';
    tip.textContent = '👋 Try the AI Safety Chat!';

    var win = document.createElement('div');
    win.id = 'fw-cb-window';
    win.innerHTML =
      '<div id="fw-cb-header">' +
        '<div id="fw-cb-avatar">🤖</div>' +
        '<div id="fw-cb-htext">' +
          '<div id="fw-cb-htitle">AI Safety Chat</div>' +
          '<div id="fw-cb-hsub">What Happens Next?</div>' +
        '</div>' +
        '<button id="fw-cb-closebtn" aria-label="Close">×</button>' +
      '</div>' +
      '<div id="fw-cb-messages"></div>' +
      '<div id="fw-cb-choices"></div>';

    document.body.appendChild(launcher);
    document.body.appendChild(tip);
    document.body.appendChild(win);

    setTimeout(function () {
      if (tip.parentNode) tip.style.display = 'none';
    }, 6000);
  }

  var picked = [];
  var current = 0;
  var started = false;

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function scrollToBottom() {
    var el = document.getElementById('fw-cb-messages');
    el.scrollTop = el.scrollHeight;
  }

  function addBotBubble(html) {
    var messages = document.getElementById('fw-cb-messages');
    var row = document.createElement('div');
    row.className = 'fw-row bot';
    var bubble = document.createElement('div');
    bubble.className = 'fw-bubble';
    bubble.innerHTML = html;
    row.appendChild(bubble);
    messages.appendChild(row);
    scrollToBottom();
  }

  function addUserBubble(text) {
    var messages = document.getElementById('fw-cb-messages');
    var row = document.createElement('div');
    row.className = 'fw-row user';
    var bubble = document.createElement('div');
    bubble.className = 'fw-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    messages.appendChild(row);
    scrollToBottom();
  }

  function showTyping(callback) {
    var messages = document.getElementById('fw-cb-messages');
    var row = document.createElement('div');
    row.className = 'fw-row bot';
    row.id = 'fw-cb-typing-row';
    row.innerHTML = '<div class="fw-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(row);
    scrollToBottom();
    setTimeout(function () {
      var t = document.getElementById('fw-cb-typing-row');
      if (t) t.remove();
      callback();
    }, 700);
  }

  function setChoices(buttonsHtml) {
    document.getElementById('fw-cb-choices').innerHTML = buttonsHtml || '';
  }

  function startGame() {
    started = true;
    picked = shuffle(ALL_SCENARIOS).slice(0, 5);
    current = 0;
    document.getElementById('fw-cb-messages').innerHTML = '';
    addBotBubble("Hey! Let's look at 5 real AI chat moments. You pick what to say, and I'll show you what happens next. There's no wrong answer here — just have fun! 👀");
    setTimeout(sendScenario, 500);
  }

  function sendScenario() {
    var s = picked[current];
    addBotBubble('<span class="fw-eyebrow">' + (current + 1) + '/' + picked.length + ' · ' + s.title + '</span>' + s.msg);
    var html = '';
    s.choices.forEach(function (choice, idx) {
      html += '<button class="fw-choice-btn" data-idx="' + idx + '">' + choice.reply + '</button>';
    });
    setChoices(html);
    Array.prototype.forEach.call(document.querySelectorAll('.fw-choice-btn'), function (btn) {
      btn.onclick = function () { onChoice(parseInt(btn.getAttribute('data-idx'), 10)); };
    });
  }

  function onChoice(idx) {
    var s = picked[current];
    var choice = s.choices[idx];
    setChoices('');
    addUserBubble(choice.reply);
    showTyping(function () {
      addBotBubble(
        '<div class="fw-outcome">' +
          '<span class="fw-label">What happens</span>' + choice.outcome +
          '<div class="fw-takeaway"><span class="fw-label">💡 Takeaway</span>' + choice.takeaway + '</div>' +
        '</div>'
      );
      var isLast = current >= picked.length - 1;
      setChoices('<button class="fw-inline-btn" id="fw-cb-next">' + (isLast ? 'See recap →' : 'Next situation →') + '</button>');
      document.getElementById('fw-cb-next').onclick = nextScenario;
    });
  }

  function nextScenario() {
    current++;
    setChoices('');
    if (current >= picked.length) {
      showTyping(function () {
        addBotBubble("That's all 5! Every choice teaches you something different. There's no winning or losing here — just learning.");
        setChoices('<button class="fw-inline-btn" id="fw-cb-replay">🔁 Play again (new 5)</button>');
        document.getElementById('fw-cb-replay').onclick = startGame;
      });
    } else {
      showTyping(sendScenario);
    }
  }

  function openWidget() {
    document.getElementById('fw-cb-window').classList.add('open');
    document.getElementById('fw-cb-launcher').classList.add('hidden');
    var tip = document.getElementById('fw-cb-tip');
    if (tip) tip.style.display = 'none';
    if (!started) startGame();
  }

  function closeWidget() {
    document.getElementById('fw-cb-window').classList.remove('open');
    document.getElementById('fw-cb-launcher').classList.remove('hidden');
  }

  function init() {
    injectStyles();
    injectMarkup();
    document.getElementById('fw-cb-launcher').onclick = openWidget;
    document.getElementById('fw-cb-closebtn').onclick = closeWidget;
    window.fwOpenChat = openWidget;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
