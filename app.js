var txnId = require('./txnId');
const fs = require("fs")

var qiwistr = fs.readFileSync("./Bqiwi.txt", { encoding: "utf8" })
console.log("QIWI loaded: " + qiwistr)

var config = {
	payeer: {
		enabled: true,
		account: "",
		apiId: ,
		apiPass: ""
	}
}

process.env.TZ = 'Moscow/Europe';
let trees = [
	{
		id: 0,
		name: "Progetto M40 Mod.65",
		earn: 35,
		price: 20
	},
	{
		id: 1,
		name: "Super Conqueror",
		earn: 75,
		price: 50
	},
	{
		id: 2,
		name: "Bat.-Châtillon 25 t",
		earn: 150,
		price: 100
	},
	{
		id: 3,
		name: "Объект 430У",
		earn: 480,
		price: 300
	},
	{
		id: 4,
		name: "60TP Lewandowskiego",
		earn: 800,
		price: 450
	},
	{
		id: 5,
		name: "Об. 279 (р)",
		earn: 1700,
		price: 800
	},
	{
		id: 6,
		name: "T110E4",
		earn: 3500,
		price: 1800
	},
	{
		id: 7,
		name: "Kranvagn",
		earn: 8000,
		price: 4200
	},
	{
		id: 8,
		name: "Maus",
		earn: 15000,
		price: 8000
	},
];


const mongo = require('mongoose');
mongo.connect('mongodb://'); //

const ADMINS = [];


var User = mongo.model('User', {
	id: Number,
	buybalance: Number,
	outbalance: Number,
	name: String,
	bhivebalance: Number,
	fc: Number,
	ref: Number,
	regDate: String,
	trees: Array,
	deposit: Number,
	payout: Number,
	fetuses: Number,
	menu: String,
	lastCollect: Number,
	ban: Boolean,
	refCount: Number,
	wb_profits: Number,
	clanName: String,
	totalEarn: Number,
	not: Boolean,
	prize: Boolean,
	spinsToday: Number,
	data: String,
	bank: Number,
	game_balance: Number,
	game_payin: Number,
	game_payout: Number,
	game_limit: Number,
	game_bet: Number,
});

var wbProfits = [0, 33, 340, 618, 982, 2200, 4978, 7470, 23027] // доход
var wbPrices = [0, 0, 120, 400, 500, 2000, 3000, 4000, 7000] // цена

var Task = mongo.model('Task', {
	id: Number
});

const Clan = mongo.model('Clan', {
	name: String,
	maxMembers: Number,
	members: Number,
	balance: Number,
	creator_id: Number,
	creator_name: String,
	zam_id: Number,
	zam_name: String,
	total_earn: Number,
	level: Number,
	bal: Number
})

const Ticket = mongo.model('Ticket', {
	id: Number,
	amount: Number,
	wallet: String
})

const BeeMother = mongo.model("BeeMothr", {
	creator_id: Number,
	end_time: Number,
	beesGet: Number,
	nextBeeGet: Number
})

const WildBee = mongo.model("WildBee", {
	creator_id: Number,
	start_time: Number,
	level: Number,
	bee_profit: Number,
})

const Start = [
	["🎖 Танки", "♻️ Обмен", "👑 Взвод"],
	["🖥 Личный кабинет", "👥 Партнёры"],
    ["📚 О боте"]
	
];

const Cancel = [
	["🚫 Отмена"]
];

const AdminPanel = [
	["📬 Рассылка", "📮 Выплаты"],
	["📧 Информация"],
	["🔙 Назад"]
];

const RM_admin = {
	inline_keyboard: [
		[{ text: "✉️ Рассылка", callback_data: "admin_mm" }],
		[{ text: "🔎 Управление пользователем", callback_data: "admin_u" }],
		[{ text: "📮 Выплаты", callback_data: "admin_w" }],
		[{ text: "🗒 Чек", callback_data: "a_voucher" }],
		[{ text: "✏️ Бонус к пополнению", callback_data: "admin_b" }],
		[{ text: "✏️ Лимит количества танков", callback_data: "admin_limit" }],
		[{ text: "⚜️ Магическое место", callback_data: "admin_bm" }],
		[{ text: "🕒 Топ за 24 часа", callback_data: "admin_top" }],
	]
}

const RM_admin_return = { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_return" }],] }
const Voucher = mongo.model("Voucher", { id: String, tree_id: Number })
function generateID(res) { var text = ""; var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; for (var i = 0; i < res; i++)text += possible.charAt(Math.floor(Math.random() * possible.length)); return text }

const RM_mm1 = {
	inline_keyboard: [
		[{ text: "⏹ Стоп", callback_data: "admin_mm_stop" }],
		[{ text: "⏸ Пауза", callback_data: "admin_mm_pause" }],
	]
}

const RM_mm2 = {
	inline_keyboard: [
		[{ text: "⏹ Стоп", callback_data: "admin_mm_stop" }],
		[{ text: "▶️ Продолжить", callback_data: "admin_mm_play" }],
	]
}



const { Qiwi } = require('node-qiwi-api');
const qiwi = new Qiwi(qiwistr.split(" ")[1]);

const Telegram = require('node-telegram-bot-api');
const bot = new Telegram('1205816982:AAGz3yN4jX6izLah7OIgrJUs3Ayhqm821V0', { polling: true });

bot.getMe().then(r => console.log(r))

bot.on('text', async (message) => {
	message.send = (text, params) => bot.sendMessage(message.chat.id, text, params);
	let $menu = [];
	var uid = message.from.id
	var text = message.text
	let dt = new Date
	console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + uid + " отправил: " + text)
let user0 = await User.findOne({ id: 0 });
  if(!user0){
    let schema = {
      id: 0,
      buybalance: 0,
      outbalance: 0,
      bhivebalance: 0,
      wb_profits: 0,
      name: 'NMI_FUN',
      ref: 0,
      deposit: 0,
      payout: 0,
      fc: 0
    }

    let user = new User(schema);
    await user.save();
  }

  let user1 = await User.findOne({ id: 1 });
  if(!user1){
    let schema = {
      id: 1,
      buybalance: 0,
      outbalance: 0,
      bhivebalance: 0,
      wb_profits: 0,
      name: 'NMI_FUN',
      ref: 0,
      deposit: 0,
      payout: 0,
      menu: "{\"price\":20,\"status\":true,\"count\":5,\"bought\":3}"
    }

    let user = new User(schema);
    await user.save();
  }
	Start.map((x) => $menu.push(x));
	if (ADMINS.find((x) => x == message.from.id)) $menu.push(["🔝 Админка"]);

	if (message.text) {
		if (message.text.startsWith('/start') || message.text == '🔙 Назад') {
			let $user = await User.findOne({ id: message.from.id });
			if (!$user) {
				let schema = {
					id: message.from.id,
					buybalance: 0,
					outbalance: 0,
					bhivebalance: 0,
					wb_profits: 0,
					name: message.from.first_name,
					fc: 0,
					ref: 0,
					regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
					trees: [],
					deposit: 0,
					payout: 0,
					fetuses: 0,
					menu: "",
					lastCollect: Date.now(),
					ban: false,
					refCount: 0,
					not: false,
					data: "",
					bank: 0,
				}

				let reffer = Number(message.text.split('/start ')[1]);

				if (reffer) {
					let $reffer = await User.findOne({ id: reffer });
					if ($reffer) {
						schema.ref = $reffer.id;
						await $reffer.inc('buybalance', 0.25);
						await $reffer.inc('refCount', 1);
						bot.sendMessage($reffer.id, `🔔 Вы пригласили <a href="tg://user?id=${message.from.id}">партнёра</a> и получили 0.25₽`, { parse_mode: "HTML" });
					}
				}

				let user = new User(schema);
				await user.save();
			}

			let postfix = message.text.split('/start ')[1]
			if (postfix) {
				if (postfix[0] == "C") {
					message.user = await User.findOne({ id: message.from.id });

					var c = await Voucher.findOne({ id: postfix.substr(1) })
					if (c) {
						let total_balance = 0;
						message.user.trees.map((x) => {
							if ((((Date.now() - message.user.lastCollect) / 1000) / 60) * (trees.find((a) => a.id == x.id).earn / 60) > (trees.find((a) => a.id == x.id).earn * 72)) { total_balance += trees.find((a) => a.id == x.id).earn * 72; } else { total_balance += (((Date.now() - message.user.lastCollect) / 1000) / 60) * (trees.find((a) => a.id == x.id).earn / 60); }
						})
						await Voucher.deleteOne({ _id: c._id })
						await message.user.set('lastCollect', Date.now());
						await message.user.inc('fetuses', Number(total_balance.toFixed(2)));
						await message.user.trees.push({ id: c.tree_id, date: Date.now(), lastCollect: Date.now() });
						await message.user.save();
						return bot.sendPhoto(message.chat.id, `c${c.tree_id}.png`, { caption: `✅ Вы успешно активировали чек и получили танк - <b>${(trees.find((a) => a.id == c.tree_id)).name}</b>`, parse_mode: "HTML", })
					}
				}
			}
			return message.send(`
✌️ <b>Привет, ${message.from.first_name} ${message.from.last_name}</b>
📝 <b>Цель игры:</b>
├─Пополняем счет 🤘
├─Покупаем танки 💎
├─Собираем доход 💸
├─Обмениваем доход 💵
└─Получаем деньги 💹
❓ Чем мы выплачиваем?
❗️ С пополнений бота, продажи рекламы и других наших проектов
🏝 <b>Чат</b> 👉 @WoT_Chats
💳 <b>Выплаты</b> 👉 @WoT_Pay
📢 <b>Новости</b> 👉 @WoT_infoo`, {
				parse_mode: "HTML",
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
	
			});
		}
	}

	message.user = await User.findOne({ id: message.from.id });
	if (!message.user) return message.send(`Что-то пошло не так... Напишите /start`);
	if (message.user.ban) return
	if (!message.user.name || message.user.name != message.from.first_name)
		await User.findOneAndUpdate({ id: message.from.id }, { name: message.from.first_name })

	if (state[uid] == 7770 && ADMINS.indexOf(message.from.id) !== -1 && text != "0") {
		state[uid] = undefined
		bot.sendMessage(uid, "Рассылка запущена!").then((e) => {
			if (text.split("#").length == 4) {
				var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
				var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
				text = text.split("#")[0]
				mm_t(text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)
			}
			else mm_t(text, e.message_id, e.chat.id, false, false, false, 100)
		})
	}

	if (state[uid] == 77771 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
		bm.count = Number(text)
		bm.bought = 0
		bm.status = true
		await User.findOneAndUpdate({ id: 1 }, { menu: JSON.stringify(bm) })
		return message.send(`${text} магическое место выпущено на продажу по цене ${bm.price}!`, { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_bm" }]] } });
	}
	if (state[uid] == 77772 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
		bm.price = Number(text)
		await User.findOneAndUpdate({ id: 1 }, { menu: JSON.stringify(bm) })
		return message.send(`Стоимость магического места установлена в ${bm.price} рублей!`, { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_bm" }]] } });
	}
	if (state[uid] == 77773 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
		bm.count = Number(text)
		await User.findOneAndUpdate({ id: 1 }, { menu: JSON.stringify(bm) })
		return message.send(`Количество доступных магических мест установлено в ${bm.count} штук!`, { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_bm" }]] } });
	}

	if (state[uid] == 7771 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		text = Number(text.replace("%", ""))
		await User.findOneAndUpdate({ id: 0 }, { deposit: text })
		return message.send(`Бонус к пополнению в ${text}% установлен!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 7771222 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		text = Number(text.replace("%", ""))
		await User.findOneAndUpdate({ id: 0 }, { bhivebalance: text })
		return message.send(`Лимит на танки в ${text} единиц установлен!`, { reply_markup: RM_admin_return });
	}

	if (state[uid] == 7772 && ADMINS.indexOf(message.from.id) !== -1 && text != "0") {
		state[uid] = undefined

		message.text = Number(message.text);
		let user = await User.findOne({ id: message.text });
		let u = user
		if (!user) return message.send('Пользователь не найден');

		let partners = await User.find({ ref: message.text });
		await message.user.set('menu', '');
		var kb = { inline_keyboard: [] }
		if (u.ban) kb.inline_keyboard.push([{ text: "♻️ Разбанить", callback_data: "unban_" + u.id }])
		else kb.inline_keyboard.push([{ text: "🛑 Забанить", callback_data: "ban_" + u.id }])
		kb.inline_keyboard.push([{ text: "➕ Баланс покупок", callback_data: "addBuyBal_" + u.id }, { text: "✏️ Баланс покупок", callback_data: "editBuyBal_" + u.id }])
		kb.inline_keyboard.push([{ text: "➕ Баланс вывода", callback_data: "addOutBal_" + u.id }, { text: "✏️ Баланс вывода", callback_data: "editOutBal_" + u.id }])
		kb.inline_keyboard.push([{ text: "➕ Пополнения", callback_data: "addPayIns_" + u.id }, { text: "✏️ Пополнения", callback_data: "editPayIns_" + u.id }])
		kb.inline_keyboard.push([{ text: "➕ Выведено", callback_data: "addPayOuts_" + u.id }, { text: "✏️ Выведено", callback_data: "editPayOuts_" + u.id }])
		kb.inline_keyboard.push([{ text: "➕ Выдать танк", callback_data: "giveTree_" + u.id }, { text: "❌ Забрать танк", callback_data: "takeTree_" + u.id }])

		kb.inline_keyboard.push([{ text: "◀️ Назад", callback_data: "admin_return" }])

		return message.send(`📝 Пригласил: <b>${partners.length}</b>

🆔 ID: <code>${user.id}</code>

💰 Баланс:
🛒 Для покупок: ${user.buybalance.toFixed(2)}₽
📭 Для вывода: ${user.outbalance.toFixed(2)}₽

⚔️ Мои танки: <b>${user.trees.length}</b>

<b>Пополнил: ${roundPlus(user.deposit)}₽</b>
<b>Вывел: ${roundPlus(user.payout)}₽</b>
`, {
			parse_mode: "HTML",
			reply_markup: kb
		});

	}

	if (state[uid] == 7773 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { $inc: { buybalance: Number(text) } })
		bot.sendMessage(data[uid], `💰 Ваш баланс для покупок пополнен на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Баланс для покупок пользователя пополнен на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 7774 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { $inc: { outbalance: Number(text) } })
		bot.sendMessage(data[uid], `💰 Ваш баланс для вывода пополнен на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Баланс для вывода пользователя пополнен на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 77745 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { $inc: { bhivebalance: Number(text) } })
		bot.sendMessage(data[uid], `💰 Ваш баланс криптовалюты WAVES пополнен на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`WAVES баланс пользователя пополнен на ${text} WAVES!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 777455 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { deposit: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш сумма Ваших пополнений пополнена на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Сумма пополнений пользователя пополнена на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 77745555 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { payout: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш сумма Ваших выводов пополнена на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Сумма выводов пользователя пополнена на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 7775 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { buybalance: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш баланс для покупок изменён на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Баланс для покупок пользователя изменён на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 7776 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { outbalance: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш баланс для вывода изменён на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Баланс для вывода пользователя изменён на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 77765 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { bhivebalance: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш баланс криптовалюты WAVES изменён на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`WAVES Баланс пользователя изменён на ${text} WAVES!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 777655 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { deposit: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш сумма Ваших пополнений измена на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Сумма пополнений пользователя изменёна на ${text}₽!`, { reply_markup: RM_admin_return });
	}
	if (state[uid] == 77765555 && ADMINS.indexOf(message.from.id) !== -1) {
		state[uid] = undefined
		await User.findOneAndUpdate({ id: data[uid] }, { payout: Number(text) })
		bot.sendMessage(data[uid], `💰 Ваш сумма Ваших выводов измена на <b>${text}₽</b>!`, { parse_mode: html })
		return message.send(`Сумма выводов пользователя изменёна на ${text}₽!`, { reply_markup: RM_admin_return });
	}

	if (message.text) {
		if (message.text == '🚫 Отмена') {
			state[uid] = undefined
			await message.user.set('menu', '');
			return message.send('🚫 Отменено.', {
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (message.user.menu == 'reinvest') {
		message.text = Number(message.text);

		if (!message.text) return message.send('Введите сумму для реинвестирования!');
		if (message.text <= 0) return message.send('Введите сумму для реинвестирования!');

		if (message.text > message.user.outbalance) return message.send('Недостаточно средств.');
		else if (message.text <= message.user.outbalance) {
			await message.user.set('menu', '');

			await message.user.dec('outbalance', message.text);
			await message.user.inc('buybalance', message.text);

			return message.send(`Вы успешно реинвестировали ${message.text.toFixed(2)}₽`, {
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (state[uid] == 66666) {
		message.text = Number(message.text);
		if (!message.text) return message.send('Введите число:');
		if (message.text <= 0) return message.send('Введите сумму больше 0:');
		if (message.text > message.user.outbalance) return message.send('Недостаточно средств.');
		if (message.text <= message.user.outbalance) {
			await message.user.dec('outbalance', message.text);
			await message.user.inc('game_balance', message.text);
			await message.user.inc('game_payin', message.text);
			state[uid] = undefined
			return message.send(`💳 Вы успешно пополнили игровой баланс на ${message.text}₽ с баланса для вывода!`, {
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (state[uid] == 66667) {
		message.text = Number(message.text);
		if (!message.text) return message.send('Введите число:');
		if (message.text <= 0) return message.send('Введите сумму больше 0:');
		if (message.text > message.user.game_balance) return message.send('Недостаточно средств.');
		if (message.text <= message.user.game_balance) {
			await message.user.dec('game_balance', message.text);
			await message.user.inc('outbalance', message.text);
			await message.user.inc('game_payout', message.text);
			state[uid] = undefined
			return message.send(`💳 Вы успешно вывели ${message.text}₽ с игрового баланса на баланс для вывода!`, {
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (message.user.menu.startsWith('amountQiwi')) {
		message.text = Number(message.text);

		if (!message.text) return message.send('Введите сумму на вывод!');
		if (message.text <= 0) return message.send('Введите сумму на вывод!');

		if (message.text > message.user.outbalance) return message.send('Недостаточно средств.');
		if (message.text < 10) return message.send('Введите сумму более 10 рублей!');
		


		if (message.text <= message.user.outbalance) {
			await message.user.dec('outbalance', message.text);
			//await message.user.inc('payout', message.text);

			if (message.text + message.user.payout >= message.user.deposit * 2) {
				message.send(`Вы вывели из бота в 2 раза больше, чем вложил\nВаш аккаунт обнулён`);
				await message.user.updateOne({ trees: [], buybalance: 0, outbalance: 0, deposit: 0, payout: 0 })
				await WildBee.updateMany({ creator_id: uid }, { level: 1 })
			}
			let ticket = new Ticket({
				id: message.from.id,
				amount: message.text,
				wallet: message.user.menu.split('amountQiwi')[1]
			});

			await ticket.save();
			await message.user.set('menu', '');

			return message.send('Заявка на выплату создана, ожидайте.', {
				reply_markup: {
					keyboard: $menu,
					resize_keyboard: true
				}
			});
		}
	}

	if (message.user.menu == 'qiwi') {

		if (message.text.length < 5) return message.send('Введите правильный номер!', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});



		await message.user.set('menu', 'amountQiwi' + message.text);
		return message.send(`Введите сумму на вывод. Вы можете вывести ${message.user.outbalance.toFixed(2)}₽ - укажите данную сумму, если укажете другую, будет ошибка!`);
	}

	if (message.text) {
		if (message.text == '🎖 Танки') {
			return message.send('Выберите, куда зайти.', {
				reply_markup: {
					inline_keyboard: [
						[{ text: "🛒 Магазин", callback_data: "store" }],
						[{ text: "🎖 Мои танки", callback_data: "trees:inv0" }],
					]
				}
			});
		}

		if (message.text == '🎁 Подарок') {
			return message.send(`<b>👇 Ваш подарок здесь 👇/b>\n
<b>💰 Игровой баланс:</b> ${roundPlus(message.user.game_balance)}₽\n
💳 <b>Пополнено:</b> ${roundPlus(message.user.game_payin)}₽
🤑 <b>Выведено:</b> ${roundPlus(message.user.game_payout)}₽
${(message.user.game_limit > 0) ? `❗️ Для вывода осталось сыграть <b>${message.user.game_limit}</b> игр сегодня` : `<b>✅ Вывод открыт!</b>`}
`, {
				parse_mode: "html",
				reply_markup: {
					inline_keyboard: [
						[{ text: "💳 Пополнить", callback_data: "game_payin" }, { text: "🤑 Вывести", callback_data: "game_payout" }],
						[{ text: "🔒 Сундук", callback_data: "game_chest" }],
						[{ text: "💈 Рулетка", callback_data: "game_roulette" }],
						[{ text: "🎰 Колесо фортуны", callback_data: "game_casino" }],
						[{ text: "💣 Минное поле", callback_data: "game_bomb" }],
						[{ text: "🎁 Подарок", callback_data: "game_prize" }]
					]
				}
			});
		}

		if (message.text == '♻️ Обмен') {
			return message.send(`Здесь Вы сможете обменять <b>🎖 голду</b> на <b>₽ рубли</b>

1000 Голды 🎖 = 1 рубль
Минимальная сумма обмена: 1000 🎖 Голды

🎖 <b>У вас голды:</b> ${message.user.fetuses.toFixed(2)}

После обмена 50% попадает на баланс для покупок, а остальные 50% на баланс для вывода`, {
				reply_markup: {
					inline_keyboard: [
						[{ text: "🔄 Обменять", callback_data: "exchange" }]
					]
				},
				parse_mode: "html"
			});

		}

		if (message.text == '🖥 Личный кабинет') {
			return message.send(`📝 Имя: <b>${message.from.first_name.replace(/(\<|\>)/g, '')}</b>

🆔 <b>ID:</b> <code>${message.from.id}</code>

🛒 <b>На покупки:</b> ${message.user.buybalance.toFixed(2)}₽
📭 <b>На вывод:</b> ${message.user.outbalance.toFixed(2)}₽
🛑 <b>Вы можете вывести:</b> ${roundPlus(message.user.deposit * 2)}₽

⚔️ <b>Мои танки:</b> ${message.user.trees.length}

💸 <b>Пополнено:</b> ${message.user.deposit.toFixed(2)}₽
🤑 <b>Выведено:</b> ${message.user.payout.toFixed(2)}₽`, {
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "📥 Пополнить", callback_data: "deposit" }, { text: "📤 Вывести", callback_data: "withdraw" }],
						[{ text: "♻️ Реинвест", callback_data: "reinvest" }, { text: "⚔️ Мои танки", callback_data: "trees:totalMy" }],
					]
				}
			});
		}

		if (message.text == '👥 Партнёры') {
			return message.send(`🧨 Партнёрская программа:🧨
	➖➖➖➖➖➖➖➖➖➖ 
🔑 <b>В нашей системе вы получаете:</b>

🔸 0.25 💸 - за каждого приглашенного партнёра
🔸 10% с пополнений ваших партнёров:
  5% на баланс для покупок и 5% на вывод

🔗 <b>Ваша ссылка для приглашений:</b> https://t.me/WoT_MoneyBot?start=${message.from.id} - ссылка для Telegram

https://tgdo.me/WoT_MoneyBot?start=${message.from.id} - ссылка для всех остальных сервисов.

🎊 Вы пригласили: <b>${await User.countDocuments({ ref: message.from.id })} чел.</b>

Когда количество приглашенных превысет <b>100 человек</b>, перешлите данное сообщение администратору с указанием вашего ID (${message.from.id}), вы будете награждены особенным бонусом.

<b>❗️ Приводи друзей - зарабатывайте вместе 👍💰 ❗️</b>

		`, {
				parse_mode: "HTML"
			})
		}

		if (message.text == '👑 Взвод') {
			if (!message.user.clanName)
				return message.send(`
🤷 Ты пока еще не состоишь во взводе!

😎 Ты можешь либо создать его сам, либо дождаться, пока кто-то тебя пригласит!

Цена создания взвода, который может содержать в себе до 10 человек - 65 рублей!
`, {
					parse_mode: "HTML", reply_markup: {
						inline_keyboard: [
							[{ text: "➕ Создать взвод (65 рублей)", callback_data: "clan_create" }],
							[{ text: "⚔️ ТОП взводов", callback_data: "clan_top" }],
							[{ text: "❗️ Статус битвы", callback_data: "clan_status" }],
						]
					}
				})

			else {
				var clan = await Clan.findOne({ name: message.user.clanName })
				var members = await User.find({ $and: [{ id: { $ne: clan.zam_id } }, { id: { $ne: clan.creator_id } }], clanName: clan.name })
				var admin = await User.findOne({ id: clan.creator_id })
				var zam = await User.findOne({ id: clan.zam_id })
				var reply_markup = { inline_keyboard: [] }
				if (clan.creator_id == uid || clan.zam_id == uid)
					reply_markup.inline_keyboard.push([{ text: "⚙️ Управление взводом", callback_data: "clan_admin" }])
				reply_markup.inline_keyboard.push([{ text: "💳 Пополнить баланс взвода", callback_data: "clan_payin" }])
				reply_markup.inline_keyboard.push([{ text: "⚔️ ТОП взводов", callback_data: "clan_top" }])
				reply_markup.inline_keyboard.push([{ text: "❗️ Статус битвы", callback_data: "clan_status" }])
				return message.send(`
⚔️ <b>Ваш взвод:</b> ${clan.name}\n
<b>Участники взвода:</b>
Имя | Доходность
👑 <b>Глава</b> - <a href="tg://user?id=${clan.creator_id}">${clan.creator_name}</a> | ${admin.totalEarn} 🎖/час${clan.zam_id ? `\n👨‍⚕️ <b>Заместитель</b> - <a href="tg://user?id=${clan.zam_id}">${clan.zam_name}</a> | ${zam.totalEarn} 🎖/час` : ""}
${members.map(m => { return `<a href="tg://user?id=${m.id}">${m.name}</a> | ${m.totalEarn} 🎖/час` }).join("\n")}\n
<b>Доход казны:</b> ${clan.level}%
<b>Всего игроков во взводе:</b> ${members.length + 1} из ${clan.maxMembers}
<b>Доходность взвода:</b> ${roundPlus(clan.total_earn)} 🎖/час
<b>В казне:</b> ${roundPlus(clan.balance)} 🎖
<b>На балансе:</b> ${roundPlus(clan.bal)}₽\n
<b>Покинуть взвод:</b> /leave_clan
`, {
					parse_mode: "HTML", reply_markup
				})
			}
		}

		if (state[uid] == 1601) {
			if (message.user.buybalance < 65) return message.send(`На Вашем балансе для покупок недостаточно средств для создания взвод!`, { parse_mode: "HTML" });
			if ((await Clan.findOne({ name: message.text })) != null) return message.send(`Взвод с таким названием уже существует!\nВведите другое название взвода:`, { parse_mode: "HTML" });
			state[uid] = undefined
			await User.findOneAndUpdate({ id: uid }, { $inc: { buybalance: -65 }, clanName: message.text })
			await Clan.insertMany([{
				name: message.text,
				maxMembers: 10,
				members: 1,
				balance: 0,
				creator_id: uid,
				creator_name: message.from.first_name,
				zam_id: 0,
				zam_name: "",
				total_earn: message.user.totalEarn,
				level: 1,
				bal: 0
			}])
			return message.send('Взвод создан!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
		}

		if (state[uid] == 160101) {
			var sum = Number(message.text)
			var clan = await Clan.findOne({ name: message.user.clanName })
			if (isNaN(sum)) return message.send(`Введите число:`, { parse_mode: "HTML" });
			if (sum <= 0) return message.send(`Введите положительное число:`, { parse_mode: "HTML" });
			if (!clan) return message.send(`Вы не состоите в клане!`, { parse_mode: "HTML" });
			if (message.user.buybalance < sum) return message.send(`На Вашем балансе для покупок недостаточно средств для пополнения баланса взвода!`, { parse_mode: "HTML" });
			state[uid] = undefined
			await User.findOneAndUpdate({ id: uid }, { $inc: { buybalance: -sum } })
			await Clan.findOneAndUpdate({ _id: clan._id }, { $inc: { bal: sum } })
			return message.send(`Баланс взвода пополнен на ${sum}₽!`, { reply_markup: { keyboard: $menu, resize_keyboard: true } });
		}

		if (message.text.startsWith("/invite") && !message.text.startsWith("/invitezam")) {
			var clan = await Clan.findOne({ name: message.user.clanName })
			var members = await User.find({ clanName: clan.name })
			if (clan.creator_id != uid && clan.zam_id != uid) return
			if (members.length > clan.maxMembers - 1) return message.send('На взвода закончились места!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			var us = await User.findOne({ id: Number(message.text.split(" ")[1]) })
			if (!us) return message.send('Пользователь не найден в боте!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			if (us.clanName) return message.send('Пользователь уже состоит во взводе!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			await bot.sendMessage(Number(message.text.split(" ")[1]), `<a href="tg://user?id=${uid}">${message.from.first_name}</a> приглашает Вас во взвод <b>${clan.name}</b>:`, { parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "✅ Подтвердить", callback_data: "clanAccept_" + clan._id }, { text: "❌ Отменить", callback_data: "clanDecline" }]] } })
			return message.send(`Запрос на вступление во взвод отправлен <a href="tg://user?id=${Number(message.text.split(" ")[1])}">пользователю</a>!`, { parse_mode: "html", reply_markup: { keyboard: $menu, resize_keyboard: true } });
		}

		if (message.text.startsWith("/kick")) {
			var clan = await Clan.findOne({ name: message.user.clanName })
			var us = await User.findOne({ id: Number(message.text.split(" ")[1]) })
			if (clan.creator_id != uid && clan.zam_id != uid) return
			if (!us) return message.send('Пользователь не найден в боте!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			if (us.clanName != clan.name) return message.send('Пользователь не состоит в Вашем взводе!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			if (us.id == uid) return message.send('Вы не можете выгнать себя!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			await User.findOneAndUpdate({ id: us.id }, { $unset: { clanName: 1 } })
			await bot.sendMessage(Number(message.text.split(" ")[1]), `❌ Вы были выгнаны из взвода <b>${clan.name}</b>!`, { parse_mode: "html" })
			return message.send(`Вы выгнали <a href="tg://user?id=${Number(message.text.split(" ")[1])}">пользователя</a> из взвода!`, { parse_mode: "html", reply_markup: { keyboard: $menu, resize_keyboard: true } });
		}
		if (message.text.startsWith("/invitezam")) {
			var clan = await Clan.findOne({ name: message.user.clanName })
			var us = await User.findOne({ id: Number(message.text.split(" ")[1]) })
			if (clan.creator_id != uid && clan.zam_id != uid) return
			if (!us) return message.send('Пользователь не найден в боте!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			if (us.clanName != clan.name) return message.send('Пользователь не состоит в Вашем взводе!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			if (us.id == uid) return message.send('Вы не назначить заместителям себя!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			await Clan.findOneAndUpdate({ name: clan.name }, { zam_id: us.id, zam_name: us.name })
			await bot.sendMessage(us.id, `❗️ Вы стали заместителем админа взводе <b>${clan.name}</b>!`, { parse_mode: "html" })
			return message.send(`Вы сделали <a href="tg://user?id=${us.id}">пользователя</a> своим заместителем!`, { parse_mode: "html", reply_markup: { keyboard: $menu, resize_keyboard: true } });
		}
		if (message.text.startsWith("/removezam")) {
			var clan = await Clan.findOne({ name: message.user.clanName })
			if (clan.creator_id != uid && clan.zam_id != uid) return
			await Clan.findOneAndUpdate({ name: clan.name }, { zam_id: 0 })
			await bot.sendMessage(clan.zam_id, `❗️ Вы больше не заместитель админа взводе <b>${clan.name}</b>!`, { parse_mode: "html" })
			return message.send(`<a href="tg://user?id=${clan.zam_id}">Пользователь</a> больше не Ваш заместитель!`, { parse_mode: "html", reply_markup: { keyboard: $menu, resize_keyboard: true } });
		}

		if (message.text.startsWith("/leave_clan")) {
			var clan = await Clan.findOne({ name: message.user.clanName })
			if (!message.user.clanName) return message.send('Вы еще не состоите в взводе!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			if (clan.creator_id == uid && !clan.zam_id) return message.send('Вы не можете выйти из своего взвода не назначив заместителя!', { reply_markup: { keyboard: $menu, resize_keyboard: true } });
			else if (clan.creator_id == uid && clan.zam_id) {
				await Clan.findOneAndUpdate({ name: clan.name }, { creator_id: clan.zam_id, creator_name: clan.zam_name, zam_id: 0 })
				await bot.sendMessage(clan.zam_id, `❗️ Вы стали администратором взвода <b>${clan.name}</b> по причине выхода владельца!`, { parse_mode: "html" })
			}
			else if (clan.zam_id == uid) await Clan.findOneAndUpdate({ name: clan.name }, { zam_id: 0 })
			await User.findOneAndUpdate({ id: uid }, { $unset: { clanName: 1 } })
			await bot.sendMessage(uid, `❌ Вы вышли из взвода <b>${clan.name}</b>!`, { parse_mode: "html" })
			await bot.sendMessage(clan.creator_id, `<a href="tg://user?id=${uid}">Пользователь</a> вышел из Вашего взвода!`, { parse_mode: "html" })
		}

		if (message.text == '📚 О боте') {
			var s = await User.findOne({ id: 0 })
			let stats = {
				users: await User.countDocuments(),
				users_today: await User.find({ regDate: `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}` }),
				cmds: message.message_id
			}

			stats.users_today = stats.users_today.length;

			return message.send(`
📊<b> Статистика проекта:</b>\n
👨‍💻 Пользователей в игре: <b>${stats.users}</b>
👨‍💻 Пользователей сегодня: <b>${stats.users_today}</b>
📥 Инвестировано всего: <b>${Math.round(s.ref) + 800 }₽</b>
📤 Выплачено всего: <b>${Math.round(s.fc) }₽</b>
🕐 Старт бота произведен 23.04.2020

<b>Хотим уведомить вас о том, что данный проект является собственноручной разработкой и никак не имеет отношение к схожим проектам.</b>
`, {
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "👨‍💻 Администратор", url: "https://t.me/duber77" }],
						[{ text: "💬 Чат", url: "https://t.me/WoT_Chats" }, {text: "📖 Отзывы", url: "https://t.me/Otzivi_WoT" }],
						[{ text: "♻️ Пополнения и выводы", url: "https://t.me/WoT_Pay" }],
						[{ text: "❓ Помощь", callback_data: "help_main" }],
						[{ text: "💎 Новости проекта", url: "https://t.me/WoT_infoo" }],
						[{ text: "🥇 Топ инвесторов", callback_data: "topInv" }, { text: "🏆 Топ рефоводов", callback_data: "topRef" }],
						[{ text: "🚀 Хочу такого-же бота", url: "https://t.me/duber77" }],
					]
				}
			});
		}
		if (state[uid] == 8877) {
			var sum = Number(message.text)
			if (isNaN(sum)) return message.send(`Введите число:`, { parse_mode: "HTML" });
			if (sum < 50) return message.send(`Введите число более 50:`, { parse_mode: "HTML" });
			if (sum > message.user.game_balance) return message.send(`На Вашем игровом балансе недостаточно средств:`, { parse_mode: "HTML" });
			state[uid] = undefined
			var field
			var arr = randomizeArr(randomizeArr([0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0]))
			field = [
				[arr[0], arr[1], arr[2], arr[3]],
				[arr[4], arr[5], arr[6], arr[7]],
				[arr[8], arr[9], arr[10], arr[11]],
				[arr[12], arr[13], arr[14], arr[15]],
			]
			await User.findOneAndUpdate({ id: uid }, { data: JSON.stringify(field), $inc: { game_balance: -sum, game_limit: -1, game_bet: sum }, bank: sum })

			return bot.sendMessage(message.chat.id, `<b>💣 Минное поле</b>\n
▫️ Всего на поле 6 мин
▫️ Минимальная сумма входа - 50₽
▫️ С каждым открытием пустой клетки начисляется +2% от суммы входа
▫️ Ваш баланс для вывода:  ${message.user.outbalance.toFixed(0)}₽
▫️ Откроете все пустые клетки - получите случайный приз:
Progetto M40 Mod.65 ▫️ Super Conqueror ▫️ 10₽ ▫️ 20₽ ▫️ 35₽ ▫️ 40₽\n
💰 <b>Банк игры:</b> ${roundPlus(sum)}₽\n
👇 <b>Выберете клетку для хода:</b>
		`, {
				parse_mode: "HTML",
				reply_markup: {
					inline_keyboard: [
						[{ text: "❓", callback_data: "gameBomb_0,0" }, { text: "❓", callback_data: "gameBomb_0,1" }, { text: "❓", callback_data: "gameBomb_0,2" }, { text: "❓", callback_data: "gameBomb_0,3" }],
						[{ text: "❓", callback_data: "gameBomb_1,0" }, { text: "❓", callback_data: "gameBomb_1,1" }, { text: "❓", callback_data: "gameBomb_1,2" }, { text: "❓", callback_data: "gameBomb_1,3" }],
						[{ text: "❓", callback_data: "gameBomb_2,0" }, { text: "❓", callback_data: "gameBomb_2,1" }, { text: "❓", callback_data: "gameBomb_2,2" }, { text: "❓", callback_data: "gameBomb_2,3" }],
						[{ text: "❓", callback_data: "gameBomb_3,0" }, { text: "❓", callback_data: "gameBomb_3,1" }, { text: "❓", callback_data: "gameBomb_3,2" }, { text: "❓", callback_data: "gameBomb_3,3" }],
						[{ text: "💰 Забрать банк", callback_data: "gameBombCollect" },],
					]
				}
			});
		}


	}

	if (ADMINS.indexOf(message.from.id) !== -1) {
		if (message.text == '🔝 Админка') {
			var h = process.uptime() / 3600 ^ 0
			var m = (process.uptime() - h * 3600) / 60 ^ 0
			var s = process.uptime() - h * 3600 - m * 60 ^ 0
			var heap = process.memoryUsage().rss / 1048576 ^ 0
			var b = (await User.findOne({ id: 0 })).deposit
			var limit = (await User.findOne({ id: 0 })).bhivebalance

			return qiwi.getBalance(async (err, balance) => {
				bot.sendMessage(uid, '<b>Админ-панель:</b>\n\n<b>Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>Памяти использовано:</b> ' + heap + "МБ\n<b>Заявок на вывод:</b> " + await Ticket.countDocuments() + "\n<b>Баланс QIWI:</b> " + balance.accounts[0].balance.amount + `₽\n<b>Бонус к пополнению:</b> ` + b + "%\n<b>Лимит на танки: </b>" + limit + " едниниц", { parse_mode: "HTML", reply_markup: RM_admin })

				/*require('request')({
					method: 'POST',
					url: 'https://payeer.com/ajax/api/api.php?getBalance',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: `account=${config.payeer.account}&apiId=${config.payeer.apiId}&apiPass=${config.payeer.apiPass}&action=getBalance`
				}, async function (error, response, body2) {
					body2 = JSON.parse(body2)
					console.log(body2)
					bot.sendMessage(uid, '<b>Админ-панель:</b>\n\n<b>Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>Памяти использовано:</b> ' + heap + "МБ\n<b>Заявок на вывод:</b> " + await Ticket.countDocuments() + "\n<b>Баланс QIWI:</b> " + balance.accounts[0].balance.amount + `₽\n<b>Баланс Payeer:</b> ${body2.balance.RUB.available}₽\n<b>Бонус к пополнению:</b> ` + b + "%\n<b>Лимит на танки: </b>" + limit + " едниниц", { parse_mode: "HTML", reply_markup: RM_admin })

				})*/
			})

		}

		if (message.text.startsWith('/setbuybalance')) {
			let cmd = message.text.split(' ');
			if (!cmd[1]) return message.send('Ошибка!');

			let user = await User.findOne({ id: Number(cmd[1]) });
			if (!user) return message.send('Пользователь не найден!');

			await user.set('buybalance', Number(cmd[2]));
			return message.send('Баланс установлен.');
		}

		if (message.text.startsWith('/setqiwi')) {
			var str = message.text.split(' ');
			var number = str[1]
			var token = str[2]
			if (number.indexOf("+") == -1) return message.send('Введите номер с +');
			if (token.length < 10) return message.send('Введите корректный токен');
			fs.writeFileSync("./Bqiwi.txt", number + " " + token, { encoding: "utf8" })
			message.send('QIWI обновлён! Перезапуск бота...');
			setTimeout(() => { process.exit(0) }, 333);
		}

		if (message.text.startsWith('/setoutbalance')) {
			let cmd = message.text.split(' ');
			if (!cmd[1]) return message.send('Ошибка!');

			let user = await User.findOne({ id: Number(cmd[1]) });
			if (!user) return message.send('Пользователь не найден!');

			await user.set('outbalance', Number(cmd[2]));
			return message.send('Баланс установлен.');
		}

	}
});

bot.on('callback_query', async (query) => {
	const { message } = query;
	message.user = await User.findOne({ id: message.chat.id });
	var uid = message.chat.id
	let dt = new Date
	console.log("[" + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + "] Пользователь " + uid + " отправил колбэк: " + query.data)

	if (!message.user) return bot.answerCallbackQuery(query.id, 'Что-то пошло не так...', true);

	if (query.data == 'none') return bot.answerCallbackQuery(query.id, 'Привет! :)', true);

	if (query.data.startsWith('trees:shop')) {
		var limit = (await User.findOne({ id: 0 })).bhivebalance
		let id = Number(query.data.split('trees:shop')[1]);
		var maxId = 0
		message.user.trees.map((t) => { if (t.id > maxId) maxId = t.id })
		let tree = trees.find((x) => x.id == id);

		var treesWithEqualId = 0
		message.user.trees.map((t) => { if (t.id == id) treesWithEqualId++ })

		if (id <= maxId + 1) {
			if (treesWithEqualId < limit)
				var bbtn = [{ text: `➕ Купить за ${tree.price}₽`, callback_data: `trees:buy${tree.id}` }]
			else var bbtn = [{ text: `🛑 Вы достигли лимита в ${limit} танков`, callback_data: getNavigationQuery(id + 1, tree.id) }]

		}
		else
			var bbtn = [{ text: `◀️ Сперва купите предыдущий танк`, callback_data: getNavigationQuery(id - 1, tree.id) }]

		if (!tree) return bot.answerCallbackQuery(query.id, 'Что-то пошло не так...', true);

		bot.deleteMessage(message.chat.id, message.message_id)
		bot.sendPhoto(message.chat.id, `c${tree.id}.png`, {
			caption: `<b>${tree.name}</b>

💰 Стоимость: ${tree.price}₽
🎖 Голды в час: ${tree.earn}`, parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [[
					{ text: getInventoryIcon(0, tree.id), callback_data: getNavigationQuery(0, tree.id) },
					{ text: getInventoryIcon(1, tree.id), callback_data: getNavigationQuery(1, tree.id) },
					{ text: getInventoryIcon(2, tree.id), callback_data: getNavigationQuery(2, tree.id) },
					{ text: getInventoryIcon(3, tree.id), callback_data: getNavigationQuery(3, tree.id) },
					{ text: getInventoryIcon(4, tree.id), callback_data: getNavigationQuery(4, tree.id) },
					{ text: getInventoryIcon(5, tree.id), callback_data: getNavigationQuery(5, tree.id) },
					{ text: getInventoryIcon(6, tree.id), callback_data: getNavigationQuery(6, tree.id) },
					{ text: getInventoryIcon(7, tree.id), callback_data: getNavigationQuery(7, tree.id) }],
				[{ text: getInventoryIcon(8, tree.id), callback_data: getNavigationQuery(8, tree.id) }],
					bbtn
				]
			}
		})
	}

	if (query.data.startsWith('topInv')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var top = await User.find({ id: { $ne: 0, $ne: 1 } }).sort({ deposit: -1 }).limit(20)
		var c = 0
		return bot.sendMessage(uid, `<b>🥇 Топ 20 инвесторов:</b>\n\n${top.map((e) => { c++; return `<b>${c})</b> <a href="tg://user?id=${e.id}">${e.name ? e.name : "пользователь"}</a> - <b>${e.deposit}₽</b>` }).join("\n")}`, { parse_mode: "html" });
	}

	if (query.data.startsWith('topRef')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var top = await User.find({ id: { $ne: 0, $ne: 1 } }).sort({ refCount: -1 }).limit(20)
		var c = 0
		return bot.sendMessage(uid, `<b>🏆 Топ рефоводов:</b>\n\n${top.map((e) => { c++; return `<b>${c})</b> <a href="tg://user?id=${e.id}">${e.name ? e.name : "пользователь"}</a> - <b>${e.refCount}</b> рефералов` }).join("\n")}`, { parse_mode: "html" });
	}

	if (query.data.startsWith('help_main')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, 'Здесь находятся ответы на часто задаваемые вопросы, выберите одну из тем, которая вас интересует:', {
			reply_markup: {
				inline_keyboard: [
					[{ text: "👥 Рефералы", callback_data: "help_refs" },
					{ text: "💎  Танки", callback_data: "help_bogs" }],
					[{ text: "📤 Вывод", callback_data: "help_po" },
					{ text: "💳 Пополнение", callback_data: "help_pi" }],]
			}
		})
	}

	if (query.data.startsWith('help_refs')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, '👥 <b>Рефералы</b>\n\nРефералы – это игроки, с регистрации которых в боте вы получаете 0.25₽, а также 10% от пополнений: по 5% на балансы для покупок и вывода\n\nДля привлечения большего числа пользователй, Вам нужно как можно активнее распространять свою парнёрскую ссылку другим пользователям\nИндивидуальную реферальную ссылку можно получить в разделе «👥 Рефералы»', { parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "help_main" }]] } })
	}
	if (query.data.startsWith('help_bogs')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, '🎖 <b>Танки</b>\n\Танки - это убийцы, которые будут будут приносить Вам доход в виде 🎖 Голды, которые можно обменять на деньги\nДля сбора Голды, зайдите в раздел «🎖 Танки» -> Мои танки,\nДля обмена голды на рубли зайдите в раздел «♻️ Обмен» и произведите обмен', { parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "help_main" }]] } })
	}
	if (query.data.startsWith('help_po')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, '📤 <b>Вывод денег</b>\n\nМинимальный вывод средств из игры: <b>10₽</b>\nЧтобы вывести средства, зайдите в раздел «🖥 Личный кабинет» ->  «Вывести»\n\nДеньги можно вывести на QIWI\n\nДля вывода на другие системы обратитесть к администратору.', { parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "help_main" }]] } })
	}
	if (query.data.startsWith('help_pi')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, '💳 <b>Пополнение</b>\n\nДля пополнения в бота зайдите в раздел «🖥 Личный кабинет» -> Пополнить\nДеньги зачисляются в течение 30 секунд\n\nТакже помните, что в комментарии к переводу надо указывать букву В английскую, а не русскую, иначе Ваш баланс не пополнится', { parse_mode: "html", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "help_main" }]] } })
	}

	if (query.data.startsWith('store')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		return bot.sendMessage(uid, 'Танки:', {
			reply_markup: {
				inline_keyboard: [
					[{ text: "⚔️  Купить танки", callback_data: "trees:shop0" }],
					[{ text: "🤴 Супер танки", callback_data: "wildBees" }],
					[{ text: "⚜️ Магическое место", callback_data: "beeMother" }],
				]
			}
		});

	}

	if (query.data.startsWith('wildBees')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var reply_markup = { inline_keyboard: [] }
		var wb = await WildBee.find({ creator_id: uid })
		wb.map((b) => { reply_markup.inline_keyboard.push([{ text: `🤴 Супер танк ${b.level} уровня`, callback_data: "wb_" + b._id }]) })
		reply_markup.inline_keyboard.push([{ text: `➕ Собрать ${message.user.wb_profits} 🎖`, callback_data: "wbCollect" }])
		reply_markup.inline_keyboard.push([{ text: "◀️ Назад", callback_data: "store" }])
		return bot.sendMessage(uid, `🤴 Супер танк могут появится только благодаря магическому месту\n
<b>Для супер танков доступно 7 уровней улучшения:</b>\n
Уровень | Голды в час | Стоимость улучшения
1 уровень - 33 🎖
2 уровень - 340 🎖 - 120₽
3 уровень - 618 🎖 - 400₽
4 уровень - 982 🎖 - 500₽
5 уровень - 2200 🎖 - 2000₽
6 уровень - 4978 🎖 - 3000₽
7 уровень - 7470 🎖 - 4000₽
8 уровень - 23027 🎖 - 7000₽
<b>Ваши супер танки:</b>`, {
			reply_markup, parse_mode: "html"
		});
	}

	if (query.data.startsWith('wbCollect')) {
		if (message.user.wb_profits == 0)
			return bot.answerCallbackQuery(query.id, '🤴 Ваши супер танки пока не принесли дохода!', true);
		else {
			bot.deleteMessage(message.chat.id, message.message_id)
			await User.findOneAndUpdate({ id: uid }, { wb_profits: 0 })
			await message.user.inc('fetuses', message.user.wb_profits)
			return bot.answerCallbackQuery(query.id, `🤴 Вы успешно собрали ${message.user.wb_profits} 🎖`, true);
		}
	}

	if (query.data.startsWith('wbUpLevel_')) {
		var wb = await WildBee.findOne({ _id: query.data.split("_")[1] })
		var price = wbPrices[wb.level + 1]
		if (message.user.buybalance < price) return bot.answerCallbackQuery(query.id, `❌ На Вашем балансе для покупок недостаточно средств для улучшения`, true);
		await User.findOneAndUpdate({ id: uid }, { $inc: { buybalance: -price } })
		await WildBee.findOneAndUpdate({ _id: String(wb._id) }, { level: wb.level + 1 })
		bot.deleteMessage(message.chat.id, message.message_id)
		wb.level++
		var reply_markup = { inline_keyboard: [] }
		if (wb.level < 8)
			reply_markup.inline_keyboard.push([{ text: `🔼 Купить ${wb.level + 1} уровень за ${wbPrices[wb.level + 1]}₽`, callback_data: `wbUpLevel_` + wb._id }])
		reply_markup.inline_keyboard.push([{ text: "◀️ Назад", callback_data: "wildBees" }])
		bot.sendPhoto(message.chat.id, "/pin.jpg", {
			caption: `
🤴 <b>Супер танки ${wb.level} уровня</b> \n
🕒 <b>В деле:</b> ${Math.floor((Date.now() - wb.start_time) / (1000 * 60 * 60 * 24))} дней
🎖 <b>Голды  в час:</b> ${wbProfits[wb.level]}
💰 <b>Принёс Голды</b>: ${ wb.bee_profit}`, parse_mode: "HTML", reply_markup
		})
		return bot.answerCallbackQuery(query.id, `🔼 Уровень супер танка повышен до ${wb.level} за ${price}₽`, true);

	}

	if (query.data.startsWith('wb')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var wb = await WildBee.findOne({ _id: query.data.split("_")[1] })
		var reply_markup = { inline_keyboard: [] }
		if (wb.level < 8)
			reply_markup.inline_keyboard.push([{ text: `🔼 Купить ${wb.level + 1} уровень за ${wbPrices[wb.level + 1]}₽`, callback_data: `wbUpLevel_` + wb._id }])
		reply_markup.inline_keyboard.push([{ text: "◀️ Назад", callback_data: "wildBees" }])
		bot.sendPhoto(message.chat.id, "/pin.jpg", {
			caption: `
🤴 <b>Супер танки ${wb.level} уровня</b> \n
🕒 <b>В деле:</b> ${Math.floor((Date.now() - wb.start_time) / (1000 * 60 * 60 * 24))} дней
🎖 <b>Голды в час:</b> ${wbProfits[wb.level]}
💰 <b>Принёс Голды</b>: ${ wb.bee_profit}`, parse_mode: "HTML", reply_markup
		})
	}

	if (query.data == ('beeMother')) {
		bot.deleteMessage(message.chat.id, message.message_id)
		console.log(await User.findOne({ id: 1 }))
		var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
		var reply_markup = {
			inline_keyboard: [
			]
		}
		var ubm = await BeeMother.findOne({ creator_id: message.user.id })
		if (ubm != null) {
			var now = new Date()
			var ttl = Math.floor((ubm.end_time - now.getTime()) / (1000 * 60 * 60 * 24))
			var str = `<b>⚜️ Ваше магическое место:</b>\n
🕐 Осталось <b>${ttl}</b> дней
⚔️ Принесло <b>${ubm.beesGet}</b> из <b>4</b> супер танков
`
		}

		else if (!bm.status) var str = '<b>❌ Магическое место недоступно</b>'
		else {
			var str = `<b>✅ Магическое место доступно!</b>\n💸 Стоимость: <b>${bm.price} рублей</b>\n🛒 Куплено <b>${bm.bought}</b> из <b>${bm.count}</b>`
			reply_markup.inline_keyboard.push([{ text: "🛒 Купить магическое место", callback_data: "beeMotherBuy" }])
		}
		reply_markup.inline_keyboard.push([{ text: "◀️ Назад", callback_data: "store" }])
		return bot.sendMessage(uid, `
<b>⚜️ Покупка магического места:</b>
❗️️️ Магическое место - это где появляются супер танки
🏦 Ваш баланс для покупок: <b>${message.user.buybalance} рублей</b>
⚜️ Магическое место появляется и исчезает с продажи когда угодно!
⚰️ Срок работы магического места - 30 дней!
⚔️ Магическое место за период своей жизни приносит 4 супер танка!\n\n${str}`, {
			reply_markup, parse_mode: "html"
		});

	}

	if (query.data == ('beeMotherBuy')) {
		var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
		if (!bm.status) return bot.answerCallbackQuery(query.id, '❌ Магическое место недоступно!', true);
		if (message.user.buybalance < bm.price) return bot.answerCallbackQuery(query.id, '❌ На Вашем балансе для покупок недостаточно средств!', true);
		bot.deleteMessage(message.chat.id, message.message_id)

		await User.findOneAndUpdate({ id: message.chat.id }, { $inc: { buybalance: -bm.price } })
		var now = new Date()
		now.setDate(now.getDate() + 7)
		var nextBeeGet = now.getTime()
		now.setDate(now.getDate() + 24)
		var end_time = now.getTime()
		await BeeMother.insertMany([{ creator_id: message.chat.id, beesGet: 0, nextBeeGet, end_time }])
		bm.bought++
		if (bm.bought >= bm.count) bm.status = false
		await User.findOneAndUpdate({ id: 1 }, { menu: JSON.stringify(bm) })
		return bot.sendMessage(uid, `
<b>⚜️ Вы успешно приобрели магическое место!</b>`, {
			reply_markup, parse_mode: "html"
		});

	}

	if (query.data.startsWith('trees:inv')) {
		let id = Number(query.data.split('trees:inv')[1]);

		let tree = trees.find((x) => x.id == id);
		if (!tree) return bot.answerCallbackQuery(query.id, 'Что-то пошло не так...', true);

		let total_balance = 0;

		message.user.trees.map((x) => {
			total_balance += (((Date.now() - message.user.lastCollect) / 1000) / 60) * (trees.find((a) => a.id == x.id).earn / 60);
		});

		let count = message.user.trees.filter((x) => x.id == tree.id).length;
		let earn = count * tree.earn;

		bot.deleteMessage(message.chat.id, message.message_id)
		bot.sendPhoto(message.chat.id, `c${tree.id}.png`, {
			caption: `<b>${tree.name}</b> (${count}x)

💰 Стоимость: ${tree.price}₽
🎖 Голды в час: ${earn}`, parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [[
					{ text: getInventoryIcon(0, tree.id), callback_data: getInventoryQuery(0, tree.id) },
					{ text: getInventoryIcon(1, tree.id), callback_data: getInventoryQuery(1, tree.id) },
					{ text: getInventoryIcon(2, tree.id), callback_data: getInventoryQuery(2, tree.id) },
					{ text: getInventoryIcon(3, tree.id), callback_data: getInventoryQuery(3, tree.id) },
					{ text: getInventoryIcon(4, tree.id), callback_data: getInventoryQuery(4, tree.id) },
					{ text: getInventoryIcon(5, tree.id), callback_data: getInventoryQuery(5, tree.id) },
					{ text: getInventoryIcon(6, tree.id), callback_data: getInventoryQuery(6, tree.id) },
					{ text: getInventoryIcon(7, tree.id), callback_data: getInventoryQuery(7, tree.id) },],
				[{ text: getInventoryIcon(8, tree.id), callback_data: getInventoryQuery(8, tree.id) },],
				[{ text: `➕ Собрать ${total_balance.toFixed(2)}🎖`, callback_data: `trees:collect` }]
				]
			}
		})

	}

	if (query.data.startsWith('trees:buy')) {
		let total_balance = 0;
		console.log(message.user.trees)
		message.user.trees.map((x) => {
			if ((((Date.now() - message.user.lastCollect) / 1000) / 60) * (trees.find((a) => a.id == x.id).earn / 60) > (trees.find((a) => a.id == x.id).earn * 72)) {
				total_balance += trees.find((a) => a.id == x.id).earn * 72;
			} else {
				total_balance += (((Date.now() - message.user.lastCollect) / 1000) / 60) * (trees.find((a) => a.id == x.id).earn / 60);
			}
		});


		let id = Number(query.data.split('trees:buy')[1]);

		let tree = trees.find((x) => x.id == id);
		if (!tree) return bot.answerCallbackQuery(query.id, 'Что-то пошло не так...', true);

		if (tree.price > message.user.buybalance) return bot.answerCallbackQuery(query.id, '🚫 Недостаточно денег для покупки.', true);
		else if (tree.price <= message.user.buybalance) {
			var limit = (await User.findOne({ id: 0 })).bhivebalance

			var treesWithEqualId = 0
			message.user.trees.map((t) => { if (t.id == id) treesWithEqualId++ })

			if (treesWithEqualId >= limit)
				return bot.answerCallbackQuery(query.id, `🛑 Вы достигли лимита в ${limit} танков данного уровня`, true);

			//await message.user.dec('buybalance', tree.price);

			await message.user.set('lastCollect', Date.now());
			await message.user.inc('fetuses', Number(total_balance.toFixed(2)));

			await message.user.trees.push({ id: tree.id, date: Date.now(), lastCollect: Date.now() });
			await message.user.save();
			await User.findOneAndUpdate({ id: uid }, { $inc: { buybalance: -tree.price } })


			return bot.answerCallbackQuery(query.id, `✅ Вы успешно приобрели ${tree.name} за ${tree.price}₽`, true);
		}
	}

	if (query.data == 'exchange') {
		if (message.user.fetuses < 1000) return bot.answerCallbackQuery(query.id, '🚫 Минимальная сумма обмена: 1000 🎖', true);
		let { fetuses } = message.user;
		await message.user.set('fetuses', 0);
		fetuses = fetuses / 1000;
		await message.user.inc('buybalance', fetuses / 2);
		await message.user.inc('outbalance', fetuses / 2);
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.answerCallbackQuery(query.id, `✅ Вы успешно обменяли ${(fetuses * 1000).toFixed(2)} 🎖 на ${fetuses.toFixed(2)}₽`, true);
	}

	if (query.data == 'deposit') {
		bot.deleteMessage(message.chat.id, message.message_id);

		var b = (await User.findOne({ id: 0 })).deposit
		if (b == 0) var bt = ""
		else var bt = `\n🔥 Временная акция для остальных пополнений: <b>+${b}%</b> при любом пополнении.`
		return bot.sendMessage(message.chat.id, `🥝 <b>Способ пополнения: QIWI</b>
🌐 Отправьте любую сумму на кошелек <code>${qiwistr.split(" ")[0]}</code>
❗️ Не забудьте комментарий <code>S${message.chat.id}</code>

📥 <b>Для пополнения с помощью других способов обращайтесь к администратору</b> @duber77\n
${bt}`, {
			parse_mode: "HTML",

		});
	}


	if (query.data == 'game_payin') {
		state[uid] = undefined
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `<b>👇 Выберете способ пополнения игрового баланса:</b>`, { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "🥝 QIWI", callback_data: "game_payin_qiwi" }], [{ text: "🎖 Payeer", callback_data: "game_payin_payeer" }], ] } })
	}

	if (query.data == 'game_payin_qiwi') {
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `
🥝 <b>Способ пополнения: QIWI</b>
🌐 Отправьте любую сумму на кошелек <code>${qiwistr.split(" ")[0]}</code>
❗️ Не забудьте комментарий <code>SG${message.chat.id}</code>
`, { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "game_payin" }]] } })
	}

	if (query.data == 'game_payin_payeer') {
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `
🎖 <b>Способ пополнения: Payeer</b>
🌐 Отправьте любую сумму на кошелек <code>${config.payeer.account}</code>
❗️ Не забудьте комментарий <code>SG${message.chat.id}</code>
`, { parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "game_payin" }]] } })
	}

	if (query.data == 'game_payin_wb') {
		bot.deleteMessage(message.chat.id, message.message_id);
		state[uid] = 66666
		return bot.sendMessage(message.chat.id, `
<b>📭 Ваш баланс для вывода:</b> ${message.user.outbalance.toFixed(0)}₽\n
<b>👉 Введите сумму для перевода на игровой баланс:</b>
`, {
			parse_mode: "HTML", reply_markup: {
				reply_markup: {
					keyboard: Cancel,
					resize_keyboard: true
				}
			}
		})
	}

	if (query.data == 'game_payout') {
		if (message.user.game_limit > 0) return bot.answerCallbackQuery(query.id, `❗️ Для вывода Вам необходимо сыграть сегодня ещё ${message.user.game_limit} игр в Колесо фортуны или Минное поле!`, true);

		bot.deleteMessage(message.chat.id, message.message_id);
		state[uid] = 66667
		return bot.sendMessage(message.chat.id, `
<b>💰 Ваш игровой баланс:</b> ${roundPlus(message.user.game_balance)}₽\n
<b>👉 Введите сумму для вывода на игровой баланс:</b>
`, {
			parse_mode: "HTML", reply_markup: {
				reply_markup: {
					keyboard: Cancel,
					resize_keyboard: true
				}
			}
		})
	}

	if (query.data == 'game_casino') {
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `<b>🎰 Колесо фортуны</b>\n
Стоимость вращения колеса - <b>100₽</b> с игрового баланса\n
<b>💰 Ваш игровой баланс:</b> ${roundPlus(message.user.game_balance)}₽\n
<b>Вы можете выиграть:</b>
▫️ Progetto M40 Mod. 65 ▫️ Super Conqueror ▫️ Bat.-Châtillon 25 t ▫️ Объект 430У ▫️ 60TP Lewandowskiego ▫️ Ещё одна прокрутку ▫️ 5₽ ▫️ 10₽ ▫️ 15₽
	`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "🎰 Испытать удачу 100₽", callback_data: "game_casino_spin" }],
				]
			}
		});
	}

	if (query.data == 'game_casino_spin') {
		if (message.user.game_balance < 100) return bot.answerCallbackQuery(query.id, '❌ На Вашем игровом балансе недостаточно средств!', true);
		await User.findOneAndUpdate({ id: uid }, { $inc: { game_balance: -100, game_limit: -1 } })
		bot.deleteMessage(message.chat.id, message.message_id);
		var val = randomInteger(1, 9)
		var reply_markup = {
			inline_keyboard: [
				[{ text: "◀️ Назад", callback_data: "game_casino" }],
			]
		}
		if (val <= 5) {
			val--
			var prize = `⚔️ Танка ${trees.find((a) => a.id == val).name}`
			giveTree(uid, val)
		}
		else if (val == 6) {
			var prize = `♻️ Ещё одну прокрутку`
			await User.findOneAndUpdate({ id: uid }, { $inc: { game_balance: 100 } })
			reply_markup.inline_keyboard[0] = [{ text: "🎰 Испытать удачу", callback_data: "game_casino_spin" }]
		}
		else if (val >= 7) {
			val = roundPlus((val - 6) * 5)
			var prize = `💰 ${val}₽ на игровой баланс`
			await User.findOneAndUpdate({ id: uid }, { $inc: { game_balance: val } })
		}
		return bot.sendMessage(message.chat.id, `🎰 <b>Вы выиграли:</b>\n\n${prize}`, {
			parse_mode: "HTML",
			reply_markup
		});
	}


	if (query.data == 'game_bomb') {
		bot.deleteMessage(message.chat.id, message.message_id);
		state[uid] = 8877
		return bot.sendMessage(message.chat.id, `<b>💣 Минное поле</b>\n
▫️ Всего на поле 6 мин
▫️ Минимальная сумма входа - 50₽
▫️ С каждым открытием пустой клетки начисляется +2% от суммы входа
▫️ Ваш игровой баланс: ${roundPlus(message.user.game_balance)}₽
▫️ Откроете все пустые клетки - получите случайный приз:
Progetto M40 Mod& 65 ▫️ Super Conqueror ▫️ 10₽ ▫️ 20₽ ▫️ 35₽ ▫️ 40₽\n
👉 <b>Введите сумму входа:</b>
	`, {
			parse_mode: "HTML",
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

	if (query.data == 'gameBombCollect') {
		await bot.answerCallbackQuery(query.id, `💰 Вы забрали банк! Вам начислено ${message.user.bank}₽!`, true);
		bot.deleteMessage(message.chat.id, message.message_id);
		await User.findOneAndUpdate({ id: uid }, { $inc: { game_balance: message.user.bank }, bank: 0 })
	}

	if (~query.data.indexOf('gameBomb')) {
		var field = JSON.parse(message.user.data)
		var coords = query.data.split("_")[1].split(",")
		var box = field[Number(coords[0])][Number(coords[1])]
		if (box == 2) return bot.answerCallbackQuery(query.id, `Вы уже открыли эту клетку!`, true);
		if (message.user.game_balance < message.user.game_bet) return bot.answerCallbackQuery(query.id, `На Вашем игровом балансе недостаточно средств!`, true);
		await User.findOneAndUpdate({ id: uid }, { $inc: { game_balance: -message.user.game_bet, game_limit: -1 } })

		if (box == 1) {
			await bot.answerCallbackQuery(query.id, `💣 Вы попались на мину!`, true);
			bot.deleteMessage(message.chat.id, message.message_id);
			await User.findOneAndUpdate({ id: uid }, { bank: 0 })
			return
		}
		else if (box == 0) {
			bot.deleteMessage(message.chat.id, message.message_id);
			field[Number(coords[0])][Number(coords[1])] = 2
			await User.findOneAndUpdate({ id: uid }, { data: JSON.stringify(field), bank: roundPlus(message.user.bank * 1.02) })
			if (!field.every(line => { return line.every(e => { return e == 2 }) })) {
				bot.sendMessage(message.chat.id, `<b>💣 Минное поле</b>\n
▫️ Всего на поле 6 мин
▫️ Минимальная сумма входа - 50₽
▫️ С каждым открытием пустой клетки начисляется +2% от суммы входа
▫️ Ваш игровой баланс: ${roundPlus(message.user.game_balance)}₽
▫️ Откроете все пустые клетки - получите случайный приз:
Морта ▫️ Мейсона ▫️ 10₽ ▫️ 20₽ ▫️ 30₽ ▫️ 40₽\n
💰 <b>Банк игры:</b> ${roundPlus(message.user.bank * 1.02)}₽\n
👇 <b>Выберете клетку для хода:</b>
						`, {
					parse_mode: "HTML",
					reply_markup: {
						inline_keyboard: [
							[{ text: field[0][0] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_0,0" }, { text: field[0][1] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_0,1" }, { text: field[0][2] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_0,2" }, { text: field[0][3] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_0,3" }],
							[{ text: field[1][0] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_1,0" }, { text: field[1][1] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_1,1" }, { text: field[1][2] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_1,2" }, { text: field[1][3] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_1,3" }],
							[{ text: field[2][0] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_2,0" }, { text: field[2][1] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_2,1" }, { text: field[2][2] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_2,2" }, { text: field[2][3] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_2,3" }],
							[{ text: field[3][0] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_3,0" }, { text: field[3][1] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_3,1" }, { text: field[3][2] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_3,2" }, { text: field[3][3] != 2 ? "❓" : "⬜️", callback_data: "gameBomb_3,3" }],
							[{ text: "💰 Забрать банк", callback_data: "gameBombCollect" },],
						]
					}
				});
			}
			else {
				var prize = randomInteger(1, 6)
				if (prize == 5) {
					giveTree(uid, 0)
					prize = "💎 Progetto M40 Mod.65"
				}
				else if (prize == 6) {
					giveTree(uid, 1)
					prize = "💎 Super Conqueror"
				}
				else {
					await message.user.inc("game_balance", prize * 10)
					prize = `💎 ${prize * 10} ₽`
				}
				bot.sendMessage(message.chat.id, `<b>💣 Вы открыли все пустые клетки!</b>\n
▫️ <b>Ваш выигрыш:</b> ${prize}`, {
					parse_mode: "HTML",
				});
			}
		}
	}

	if (query.data == 'game_prize') {
		if (message.user.prize) return bot.answerCallbackQuery(query.id, '🙂 Вы уже получили свой подарок!', true);
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `🎁 <b>Подарок - Об. 279 (р)</b>\n
Для получения подарка подпишитесь на канал:
▫️ @@WoT_Pay`, {
			parse_mode: "HTML",
			reply_markup: { inline_keyboard: [[{ text: "✅ Проверить подписку", callback_data: "game_prize_check" }]] }
		});
	}

	if (query.data == 'game_prize_check') {
		var res = await bot.getChatMember("@WoT_Pay", message.chat.id)
		if (message.user.prize) return bot.answerCallbackQuery(query.id, '🙂 Вы уже получили свой подарок!', true);
		if (res.status == 'left') return bot.answerCallbackQuery(query.id, '❌ Вы не подписались на канал!', true);
		await bot.deleteMessage(message.chat.id, message.message_id);
		message.user.trees.push({
			id: 0,
			date: Date.now(),
			lastCollect: Date.now()
		});
		message.user.prize = true
		await message.user.save();
		return bot.sendMessage(message.chat.id, `🎁 <b>Вы получили подарок! Progetto M40 Mod.65 уже с Вами</b>`, {
			parse_mode: "HTML",
		});
	}

	if (query.data == 'game_roulette') {
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `💈 <b>Рулетка</b>\n
Стоимость вращения - <b>50₽</b> с игрового баланса. Выигрыш начисляется на баланс для покупок
<b>Вращений сегодня:</b> ${message.user.spinsToday || 0}/2\n
<b>💰 Ваш игровой баланс:</b> ${roundPlus(message.user.game_balance)}₽\n
<b>В рулетке 7 ячеек:</b>
0₽ | 0₽ | 0₽ | 50₽ | 100₽ | 150₽
	`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "💈 Купить вращение за 50₽", callback_data: "game_roulette_spin" }],
				]
			}
		});
	}

	if (query.data == 'game_roulette_spin') {
		if (message.user.spinsToday >= 2) return bot.answerCallbackQuery(query.id, '❌ Вы уже купили 2 вращения сегодня!', true);
		if (message.user.game_balance < 50) return bot.answerCallbackQuery(query.id, '❌ На Вашем игровом балансе недостаточно средств!', true);
		await User.findOneAndUpdate({ id: uid }, { $inc: { game_balance: -50, spinsToday: 1 } })
		bot.deleteMessage(message.chat.id, message.message_id);
		var arr = randomizeArr([0, 0, 0, 50, 100, 150])
		await User.findOneAndUpdate({ id: uid }, { $inc: { game_balance: arr[3] } })
		return bot.sendMessage(message.chat.id, `💈 <b>Рулетка</b>\n\n
						${arr[0]}₽
						${arr[1]}₽
						${arr[2]}₽
🔹${arr[3]}₽🔹
						${arr[4]}₽
						${arr[5]}₽\n
<b>Вам начислено ${arr[3]}₽ на игровой баланс!</b>
	`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "◀️ Назад", callback_data: "game_roulette" }],
				]
			}
		});
	}

	if (query.data == 'game_chest') {
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `🔒 Выберете стоимость сундука
🍀 Вы можете найти в два раза больше ₽, а может быть, сундук окажется пустым
🎲 Вероятность: 50%`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "1₽", callback_data: "casino_1" },
					{ text: "2₽", callback_data: "casino_2" },
					{ text: "5₽", callback_data: "casino_5" },
					{ text: "10₽", callback_data: "casino_10" }],
					[{ text: "25₽", callback_data: "casino_25" },
					{ text: "50₽", callback_data: "casino_50" },
					{ text: "100₽", callback_data: "casino_100" },
					{ text: "250₽", callback_data: "casino_250" }],
				]
			}
		});
	}

	if (query.data.startsWith("casino_open")) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var bet = Number(query.data.split("_")[2])
		if (bet > message.user.game_balance) await bot.answerCallbackQuery(query.id, 'Недостаточно средств для ставки!', true);
		else if (Math.random() >= 0.58) {
			await message.user.inc("game_balance", bet)
			await bot.answerCallbackQuery(query.id, '💸 Вы выиграли ' + bet * 2 + "₽!", true);
		} else {
			await message.user.inc("game_balance", -bet)
			await bot.answerCallbackQuery(query.id, "😞 Сундук пуст", true);
		}
		return bot.sendMessage(message.chat.id, `🔒 Выберете стоимость сундука
🍀 Вы можете найти в два раза больше ₽, а может быть, сундук окажется пустым
🎲 Вероятность: 50%

💰 Ваш игровой баланс: ${roundPlus(message.user.game_balance)}₽\n
💸 Ваша ставка: ${bet} ₽
🎰 Возможный выигрыш: ${bet * 2} ₽`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "1₽", callback_data: "casino_1" },
					{ text: "2₽", callback_data: "casino_2" },
					{ text: "5₽", callback_data: "casino_5" },
					{ text: "10₽", callback_data: "casino_10" }],
					[{ text: "25₽", callback_data: "casino_25" },
					{ text: "50₽", callback_data: "casino_50" },
					{ text: "100₽", callback_data: "casino_100" },
					{ text: "250₽", callback_data: "casino_250" }],
					[{ text: "🔓 Открыть за " + bet + "₽", callback_data: "casino_open_" + bet }]
				]
			}
		})

	}

	if (query.data.startsWith("casino")) {
		bot.deleteMessage(message.chat.id, message.message_id)
		var bet = Number(query.data.split("_")[1])
		return bot.sendMessage(message.chat.id, `🔒 Выберете стоимость сундука
🍀 Вы можете найти в два раза больше ₽, а может быть, сундук окажется пустым
🎲 Вероятность: 50%

💰 Ваш баланс: ${message.user.game_balance} ₽
💸 Ваша ставка: ${bet} ₽
🎰 Возможный выигрыш: ${bet * 2} ₽`, {
			parse_mode: "HTML",
			reply_markup: {
				inline_keyboard: [
					[{ text: "1₽", callback_data: "casino_1" },
					{ text: "2₽", callback_data: "casino_2" },
					{ text: "5₽", callback_data: "casino_5" },
					{ text: "10₽", callback_data: "casino_10" }],
					[{ text: "25₽", callback_data: "casino_25" },
					{ text: "50₽", callback_data: "casino_50" },
					{ text: "100₽", callback_data: "casino_100" },
					{ text: "250₽", callback_data: "casino_250" }],
					[{ text: "🔓 Открыть за " + bet + "₽", callback_data: "casino_open_" + bet }]
				]
			}
		})
	}

	if (query.data == 'withdraw') {
		if (message.user.outbalance < 10) return bot.answerCallbackQuery(query.id, '🚫 Минимальная сумма вывода: 10₽', true);
		bot.deleteMessage(message.chat.id, message.message_id);

		await message.user.set('menu', 'qiwi');
		await bot.sendMessage(message.chat.id, 'Введите номер QIWI кошелька для вывода:\nНапример: +79001234567', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

	if (query.data == 'reinvest') {
		await message.user.set('menu', 'reinvest');
		return bot.sendMessage(message.chat.id, 'Введите сумму, которую хотите реинвестировать.', {
			reply_markup: {
				keyboard: Cancel,
				resize_keyboard: true
			}
		});
	}

	if (query.data == 'trees:collect') {
		let total_balance = 0;

		message.user.trees.map((x) => {
			total_balance += (((Date.now() - message.user.lastCollect) / 1000) / 60) * (trees.find((a) => a.id == x.id).earn / 60);
		});

		await message.user.set('lastCollect', Date.now());

		await bot.deleteMessage(message.chat.id, message.message_id);
		await message.user.inc('fetuses', Number(total_balance.toFixed(2)));
		if (message.user.clanName) {
			var clan = await Clan.findOne({ name: message.user.clanName })
			await Clan.findOneAndUpdate({ name: message.user.clanName }, { $inc: { balance: total_balance * (clan.level / 100) } })
		}
		return bot.answerCallbackQuery(query.id, `Вы успешно собрали ${total_balance.toFixed(2)} 🎖`, true);
	}

	if (query.data == 'trees:totalMy') {
		let $trees = [];
		let total_earn = 0;

		message.user.trees.map((x) => {
			$trees.push(x.id);
			total_earn += trees.find((a) => a.id == x.id).earn
		});

		let text = ``;
		if ($trees.filter((x) => x === 0).length) text += `\n\n<b>${trees.find((x) => x.id == 0).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 0).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 0).length * trees.find((x) => x.id == 0).earn}`;
		if ($trees.filter((x) => x === 1).length) text += `\n\n<b>${trees.find((x) => x.id == 1).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 1).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 1).length * trees.find((x) => x.id == 1).earn}`;
		if ($trees.filter((x) => x === 2).length) text += `\n\n<b>${trees.find((x) => x.id == 2).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 2).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 2).length * trees.find((x) => x.id == 2).earn}`;
		if ($trees.filter((x) => x === 3).length) text += `\n\n<b>${trees.find((x) => x.id == 3).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 3).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 3).length * trees.find((x) => x.id == 3).earn}`;
		if ($trees.filter((x) => x === 4).length) text += `\n\n<b>${trees.find((x) => x.id == 4).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 4).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 4).length * trees.find((x) => x.id == 4).earn}`;
		if ($trees.filter((x) => x === 5).length) text += `\n\n<b>${trees.find((x) => x.id == 5).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 5).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 5).length * trees.find((x) => x.id == 5).earn}`;
		if ($trees.filter((x) => x === 6).length) text += `\n\n<b>${trees.find((x) => x.id == 6).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 6).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 6).length * trees.find((x) => x.id == 6).earn}`;
		if ($trees.filter((x) => x === 7).length) text += `\n\n<b>${trees.find((x) => x.id == 7).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 7).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 7).length * trees.find((x) => x.id == 7).earn}`;
		if ($trees.filter((x) => x === 8).length) text += `\n\n<b>${trees.find((x) => x.id == 8).name}</b>\n\t\t▫️ Количество: ${$trees.filter((x) => x === 8).length}\n\t\t🎖 Голды в час: ${$trees.filter((x) => x === 8).length * trees.find((x) => x.id == 8).earn}`;

		return bot.editMessageText(`📄 Список Ваших танков: ⤵️${text}\n\n════════════════════\n📊 Суммарный доход голды в час: ${total_earn.toFixed(2)}🎖`, {
			parse_mode: "HTML",
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}

	if (query.data == 'checkFollow') {
		let task = await Task.findOne({ id: message.chat.id });
		if (task) return bot.deleteMessage(message.chat.id, message.message_id);

		bot.getChatMember(-1001315597472, message.chat.id).then(async (res) => {
			if (res.status == 'left') return bot.answerCallbackQuery(query.id, '🚫 Вы не подписаны!');

			message.user.trees.push({
				id: 1,
				date: Date.now(),
				lastCollect: Date.now()
			});

			await message.user.save();

			let $task = new Task({
				id: message.chat.id
			});

			await $task.save();

			return bot.editMessageText('Вы выполнили задание и получили <b>Лимонное дерево</b>.', {
				parse_mode: "HTML",
				chat_id: message.chat.id,
				message_id: message.message_id
			});
		});
	}

	if (query.data.startsWith('withdraw:')) {
		let id = Number(query.data.split('withdraw:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);
		bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${ticket.id}">Пользователь</a> вывел <b>${ticket.amount}₽</b>`, { parse_mode: "HTML" })

		if (ticket.wallet.indexOf("P") == -1) { // Платёж через QIWI
			qiwi.toWallet({ account: String(ticket.wallet), amount: ticket.amount, comment: 'Выплата от @WoT_MoneyBot' }, () => { });
		}
		else // Платёж через Payeer
		{
			require('request')({
				method: 'POST',
				url: 'https://payeer.com/ajax/api/api.php',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: `account=${config.payeer.account}&apiId=${config.payeer.apiId}&apiPass=${config.payeer.apiPass}&action=transfer&curIn=RUB&sum=${ticket.amount * 1.01}&curOut=RUB&to=${ticket.wallet}`
			}, async function (error, response, body) {
				body = JSON.parse(body)
			})
		}

		bot.sendMessage(ticket.id, `✅ <b>Ваша выплата была одобрена</b>
💸 На Ваш ${ticket.wallet.indexOf("P") == -1 ? "QIWI" : "Payeer"} зачислено <b>${ticket.amount}₽</b>\n

🙏 Будем очень признательны за отзыв о боте админу или в чат
☺️ Для нас это очень важно\n
🤝 <b>Рады сотрудничать!</b>
`, {
			parse_mode: "html", reply_markup: {
				inline_keyboard: [
					[{ text: "👨‍💻 Админ", url: "https://t.me/duber77" },
					{ text: "💬 Чат", url: "https://t.me/WoT_Chats" }],
					[{ text: "💳 Выплаты", url: "https://t.me/WoT_Pay" }],

				]
			}
		});
		await User.findOneAndUpdate({ id: 0 }, { $inc: { fc: ticket.amount } })
		await User.findOneAndUpdate({ id: id }, { $inc: { payout: ticket.amount } })
		await ticket.remove();
		bot.editMessageText('Выплатил!', {
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}

	if (query.data.startsWith('back:')) {
		let id = Number(query.data.split('back:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);

		let user = await User.findOne({ id: ticket.id });
		bot.sendMessage(ticket.id, `Ваша выплата была отклонена, на ваш счёт возвращено ${ticket.amount}₽`);

		await user.inc('buybalance', ticket.amount);
		await ticket.remove();

		return bot.editMessageText('Вернул!', {
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}

	if (query.data.startsWith('take:')) {
		let id = Number(query.data.split('take:')[1]);
		let ticket = await Ticket.findOne({ id });

		if (!ticket) bot.deleteMessage(message.chat.id, message.message_id);

		await ticket.remove();
		return bot.editMessageText('Забрал!', {
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}
	var d = query.data

	if (d == "clan_create") {
		if (message.user.buybalance < 65)
			return bot.answerCallbackQuery(query.id, `На Вашем балансе для покупок недостаточно средств для создания взвода!`, true);
		state[uid] = 1601
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, 'Введите название для Вашего взвода:', { reply_markup: { keyboard: Cancel, resize_keyboard: true } });
	}

	if (d == "clan_payin") {
		var clan = await Clan.findOne({ name: message.user.clanName })
		if (!clan) return bot.answerCallbackQuery(query.id, `Ошибка!`, true);
		state[uid] = 160101
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `💳 <b>Ваш баланс для пополнений:</b> ${message.user.buybalance}₽\nВведите сумму для пополнения баланса Вашего взвода:`, { parse_mode: "html", reply_markup: { keyboard: Cancel, resize_keyboard: true } });
	}
	if (d == "clan_admin") {
		var clan = await Clan.findOne({ name: message.user.clanName })
		var members = await User.find({ id: { $ne: uid }, clanName: clan.name })
		if (uid != clan.creator_id && uid != clan.zam_id) return bot.answerCallbackQuery(query.id, `Ошибка!`, true);
		bot.deleteMessage(message.chat.id, message.message_id);
		return bot.sendMessage(message.chat.id, `
<b>Ваш взвод:</b> ${clan.name}

<b>Участники взвода:</b>
<a href="tg://user?id=${uid}">${clan.creator_name}</a> | ${message.user.totalEarn} 🎖/час | ID: <code>${uid}</code>
${members.map(m => { return `${m.id == clan.zam_id ? `👨‍⚕️ <b>Ваш заместитель: </b>` : ""}<a href="tg://user?id=${m.id}">${m.name}</a> | ${m.totalEarn} 🎖/час | ID: <code>${m.id}</code>` }).join("\n")}
<b>Доход казны:</b> ${clan.level}%
<b>Всего игроков во взводе:</b> ${members.length + 1} из ${clan.maxMembers}
<b>Доходность взвода:</b> ${roundPlus(clan.total_earn)} 🎖/час
<b>В казне:</b> ${roundPlus(clan.balance)} 🎖
<b>На балансе:</b> ${roundPlus(clan.bal)}₽\n
<b>Команды главы:</b>
Пригласить участника во возвод - <code>/invite [id]</code>
Выгнать участника со взвода - <code>/kick [id]</code>
Назначить заместителя - <code>/invitezam [id]</code>
Убрать заместителя - <code>/removezam</code>
`, {
			parse_mode: "html", reply_markup: {
				inline_keyboard: [
					[{ text: "1⃣ Перевести казну себе", callback_data: "clan_transferMe" }],
					[{ text: "2⃣ Распределить казну", callback_data: "clan_transferAll" }],
					[{ text: `3⃣ Расширить взвод до ${clan.maxMembers + 10} мест (65 рублей)`, callback_data: "clan_expand" }],
					[{ text: `4️⃣ Повысить доходность казны до ${clan.level + 1}% (${150 + (clan.level - 1) * 50} рублей)`, callback_data: "clan_upLevel" }],
				]
			}
		});
	}
	if (d == "clan_transferMe") {
		var clan = await Clan.findOne({ name: message.user.clanName })
		var members = await User.find({ id: { $ne: uid }, clanName: clan.name })
		if (uid != clan.creator_id && uid != clan.zam_id) return bot.answerCallbackQuery(query.id, `Ошибка!`, true);
		if (clan.balance == 0) return bot.answerCallbackQuery(query.id, `Казна взвода нулевая!`, true);
		bot.deleteMessage(message.chat.id, message.message_id);
		await Clan.findOneAndUpdate({ name: clan.name }, { balance: 0 })
		await User.findOneAndUpdate({ id: uid }, { $inc: { buybalance: (clan.balance / 2000), outbalance: (clan.balance / 2000) } })
		return bot.sendMessage(message.chat.id, `<b>${clan.balance} 🎖 Голды</b> из казны взвода начислены Вам как <b>${roundPlus(clan.balance / 2000)}₽</b> на баланс для покупок и <b>${roundPlus(clan.balance / 2000)}₽</b> на баланс для вывода`, { parse_mode: "html" });
	}
	if (d == "clan_transferAll") {
		var clan = await Clan.findOne({ name: message.user.clanName })
		var members = await User.find({ clanName: clan.name })
		if (uid != clan.creator_id && uid != clan.zam_id) return bot.answerCallbackQuery(query.id, `Ошибка!`, true);
		if (clan.balance == 0) return bot.answerCallbackQuery(query.id, `Казна взвода нулевая!`, true);
		bot.deleteMessage(message.chat.id, message.message_id);
		await Clan.findOneAndUpdate({ name: clan.name }, { balance: 0 })
		var dole = clan.balance / members.length / 2000
		for (const i in members) {
			try {
				await User.findOneAndUpdate({ id: members[i].id }, { $inc: { buybalance: dole, outbalance: dole } })
				await bot.sendMessage(members[i].id, `<b>${roundPlus(clan.balance)} 🎖 Голды</b> из казны взвода распределены между участниками взвода\nВам начислено <b>${roundPlus(dole)}₽</b> на баланс для покупок и <b>${roundPlus(dole)}₽</b> на баланс для вывода`, { parse_mode: "html" });
			}
			catch { }
		}
	}
	if (d == "clan_expand") {
		var clan = await Clan.findOne({ name: message.user.clanName })
		if (uid != clan.creator_id && uid != clan.zam_id) return bot.answerCallbackQuery(query.id, `Ошибка!`, true);
		if (clan.bal < 65) return bot.answerCallbackQuery(query.id, `На балансе взвода недотаточно средств!`, true);
		bot.deleteMessage(message.chat.id, message.message_id);
		await Clan.findOneAndUpdate({ name: clan.name }, { $inc: { maxMembers: 10, bal: -65 } })
		await bot.sendMessage(uid, `Вы успешно расширили максимальное количество мест на взвода до ${clan.maxMembers + 10}`, { parse_mode: "html" });

	}
	if (d == "clan_upLevel") {
		var clan = await Clan.findOne({ name: message.user.clanName })
		if (uid != clan.creator_id && uid != clan.zam_id) return bot.answerCallbackQuery(query.id, `Ошибка!`, true);
		if (clan.level >= 20) return bot.answerCallbackQuery(query.id, `Вы достигли максимального уровня увеличения доходности казны!`, true);
		var price = 150 + (clan.level - 1) * 50
		if (clan.bal < 65) return bot.answerCallbackQuery(query.id, `На балансе взвода недотаточно средств!`, true);
		bot.deleteMessage(message.chat.id, message.message_id);
		await Clan.findOneAndUpdate({ name: clan.name }, { $inc: { level: 1, bal: -price } })
		await bot.sendMessage(uid, `Вы успешно повысили доходность казны взвода до ${clan.level + 1}%`, { parse_mode: "html" });

	}
	if (d.startsWith("clanAccept")) {
		var clan = await Clan.findOne({ _id: d.split("_")[1] })
		var members = await User.find({ clanName: clan.name })
		if (members.length > clan.maxMembers - 1) return bot.answerCallbackQuery(query.id, `Во взводе закончились места!`, true);
		bot.deleteMessage(message.chat.id, message.message_id);
		await User.findOneAndUpdate({ id: uid }, { clanName: clan.name })
		await bot.sendMessage(uid, `✅ Вы успешно вступили в взвод <b>${clan.name}</b>\nНажмите /leave_clan, чтобы покинуть взвод`, { parse_mode: "html" });
		bot.sendMessage(clan.creator_id, `➕ На ваш взвод вступил <a href="tg://user?id=${uid}">пользователь</a>\nВведите <code>/kick ${uid}</code>, чтобы выгнать участника из взвод`, { parse_mode: "html" });
		totalClanEarnCalc()
	}
	if (d == "clanDecline") {
		bot.sendMessage(uid, ` ❌ Вы отменили заявку на вступление во взвод!`, { parse_mode: "html" });
	}

	if (d == "clan_top") {
		var clans = await Clan.find({ $and: [{ name: { $ne: "." } }, { name: { $ne: "dsfsdf" } }] }).sort({ total_earn: -1 }).limit(5)
		bot.deleteMessage(message.chat.id, message.message_id);
		if (clans.length == 5)
			return bot.sendMessage(message.chat.id, `
<b>🏆 ТОП 5 Взводов 🔱</b>

👑 ${clans[0].name} | ${clans[0].total_earn} 🎖

2⃣ ${clans[1].name} | ${clans[1].total_earn} 🎖

3⃣${clans[2].name} | ${clans[2].total_earn} 🎖

4⃣ ${clans[3].name} | ${clans[3].total_earn} 🎖

5⃣ ${clans[4].name} | ${clans[4].total_earn} 🎖`, { parse_mode: "html" });
		else
			return bot.sendMessage(message.chat.id, `<b>🏆 Недостаточно взводов для составления топа</b>`, { parse_mode: "html" });

	}
	if (d == "clan_status") {
		var clans = await Clan.find({ $and: [{ name: { $ne: "." } }, { name: { $ne: "dsfsdf" } }] }).sort({ total_earn: -1 }).limit(5)
		bot.deleteMessage(message.chat.id, message.message_id);
		var ost = Math.ceil((getNextClanWarTimestamp() - (new Date()).getTime()) / (1000 * 60 * 60 * 24))
		if (clans.length == 5)
			return bot.sendMessage(message.chat.id, `
<b>💎 Битва взводов</b>

🕒 Битва взводов происходит 5, 15 и 25-го числа каждого месяца!
🏆 Взвод-победитель получает <b>🎖 100k Голды</b> в свою казну
За 2 место - <b>🎖 50k Голды</b>
За 3 место - <b>🎖 30k Голды</b>
За 4 место - <b>🎖 15k Голды</b>
За 5 место - <b>🎖 5k Голды</b>

<b>До следующей битвы:</b> ${ost} дней

<b>🛡 ТОП взводов текущей битвы 🛡</b>

1. ${clans[0].name} - ${clans[0].total_earn} 🎖 в час
2. ${clans[1].name} - ${clans[1].total_earn} 🎖 в час
3. ${clans[2].name} - ${clans[2].total_earn} 🎖 в час
4. ${clans[3].name} - ${clans[3].total_earn} 🎖 в час
5. ${clans[4].name} - ${clans[4].total_earn} 🎖 в час
`, { parse_mode: "html" });
		else
			return bot.sendMessage(message.chat.id, `<b>🏆 Недостаточно взводов для составления топа</b>`, { parse_mode: "html" });
	}


	if (ADMINS.indexOf(query.from.id) !== -1) {
		if (d == "admin_mm") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите текст рассылки или отправьте изображение:\n\n<i>Для добавления кнопки-ссылки в рассылаемое сообщение добавьте в конец сообщения строку вида:</i>\n# Текст на кнопке # http://t.me/link #', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7770
		} else if (d == "admin_w") {
			bot.deleteMessage(message.chat.id, message.message_id);
			let tickets = await Ticket.find();
			if (tickets.length == 0) return bot.sendMessage(uid, 'Заявок на вывод нет');
			await tickets.map((x) => {
				bot.sendMessage(uid, `📝 Игрок: <a href="tg://user?id=${x.id}">Игрок</a> (ID: <code>${x.id}</code>)\n
	💰 Сумма: <code>${x.amount}</code>₽
	🥝 Кошелёк: <code>${x.wallet}</code>`, {
					parse_mode: "HTML", reply_markup: { inline_keyboard: [[{ text: '📭 Подтвердить выплату', callback_data: `withdraw:${x.id}` }], [{ text: '♻️ Вернуть', callback_data: `back:${x.id}` }], [{ text: '🚫 Забрать', callback_data: `take:${x.id}` }]] }
				});
			});
		}
		else if (d.startsWith("admin_bm")) {
			bot.deleteMessage(message.chat.id, message.message_id);
			var bm = JSON.parse((await User.findOne({ id: 1 })).menu)
			if (d.split("_")[2] == "false") bm.status = false
			if (d.split("_")[2] == "true") bm.status = true
			await User.updateOne({ id: 1, menu: JSON.stringify(bm) })
			console.log(bm)
			bot.sendMessage(uid, `Настройки магического места:\n
Стоимость: ${bm.price} рублей
Статус: ${bm.status ? "✅ доступна для покупки" : "❌ недоступна для покупки"}
Доступно: ${bm.count}
Куплено: ${bm.bought}
`, {
				reply_markup: {
					inline_keyboard: [
						[{ text: 'Выпустить магическое место', callback_data: `Admin_bm_new` }],
						[{ text: 'Изменить стоимость', callback_data: `Admin_bm_price` }],
						[{ text: 'Изменить доступных', callback_data: `Admin_bm_count` }],
						[{ text: (bm.status ? 'Сделать непоступной' : "Сделать доступной"), callback_data: (bm.status ? 'admin_bm_false' : "admin_bm_true") }],
						[{ text: "◀️ Назад", callback_data: "admin_return" }],
					]
				}, parse_mode: "HTML"
			})
		}
		else if (d == "admin_top") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var u = await User.find({ ref: { $ne: 0 }, _id: { $gt: mongo.Types.ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60) } })
			console.log(u)
			var top = []
			u.map((e) => {
				var t = top.filter(u => { if (e.ref == u.id) return true; else return false })
				if (t.length == 0) top.push({ id: e.ref, ref: 1 })
				else {
					top = top.filter(u => { if (e.ref == u.id) return false; else return true })
					top.push({ id: e.ref, ref: t[0].ref + 1 })
				}
			})
			top = top.sort((a, b) => { if (a.ref <= b.ref) return 1; else return -1 })
			top.length = 20
			var str = `<b>🕒 Топ рефоводов за 24 часа:</b>\n\n`
			for (const i in top) {
				var us = await User.findOne({ id: top[i].id })
				str += `<b>${Number(i) + 1})</b> <a href="tg://user?id=${us.id}">${us.name ? us.name : "Пользователь"}</a> - <b>${top[i].ref}</b> рефералов\n`
			}
			bot.sendMessage(uid, str, { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_return" }]] }, parse_mode: "HTML" })
		}
		else if (d == "Admin_bm_new") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите количество магических мест для продажи (число купивших обнулится, и магические места станут автоматически доступны для покупки по текущей стоимости и пропадут с покупки, когда число купивших привысит доступное количество):', { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_bm" }]] }, parse_mode: "HTML" })
			state[uid] = 77771
		}
		else if (d == "Admin_bm_price") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новую стоимость магического места в рублях:', { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_bm" }]] }, parse_mode: "HTML" })
			state[uid] = 77772
		}
		else if (d == "Admin_bm_count") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новое количество доступных магических мест:', { reply_markup: { inline_keyboard: [[{ text: "◀️ Назад", callback_data: "admin_bm" }]] }, parse_mode: "HTML" })
			state[uid] = 77773
		}
		else if (d == "admin_b") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите % для бонуса к пополнению или 0 для отключения:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7771
		}
		else if (d == "admin_limit") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите максимально возможное количество танков для покупки:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7771222
		}

		else if (d == "admin_u") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите ID пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7772
		}
		else if (d.split("_")[0] == "addBuyBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму пополнения баланса для покупок пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7773
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "addOutBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму пополнения баланса для вывода пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7774
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "addBHIVEBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму пополнения WAVES баланса пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 77745
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "addPayIns") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму для добавления в сумму пополнений пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 777455
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "addPayOuts") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите сумму для добавления в сумму выводов пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 77745555
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "editBuyBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новый баланс для покупок пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7775
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "editOutBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новый баланс для вывода пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 7776
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "editBHIVEBal") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новый WAVES баланс пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 77765
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "editPayIns") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новую сумму пополнений пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 777655
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "editPayOuts") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Введите новую сумму выводов пользователя:', { reply_markup: RM_admin_return, parse_mode: "HTML" })
			state[uid] = 77765555
			data[uid] = d.split("_")[1]
		}
		else if (d.split("_")[0] == "giveTree") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Выберете танк для выдачи:', { reply_markup: { inline_keyboard: [[{ text: trees[0].name, callback_data: "giveTree2_" + d.split("_")[1] + "_0" }], [{ text: trees[1].name, callback_data: "giveTree2_" + d.split("_")[1] + "_1" }], [{ text: trees[2].name, callback_data: "giveTree2_" + d.split("_")[1] + "_2" }], [{ text: trees[3].name, callback_data: "giveTree2_" + d.split("_")[1] + "_3" }], [{ text: trees[4].name, callback_data: "giveTree2_" + d.split("_")[1] + "_4" }], [{ text: trees[5].name, callback_data: "giveTree2_" + d.split("_")[1] + "_5" }], [{ text: trees[6].name, callback_data: "giveTree2_" + d.split("_")[1] + "_6" }], [{ text: trees[7].name, callback_data: "giveTree2_" + d.split("_")[1] + "_7" }], [{ text: trees[8].name, callback_data: "giveTree2_" + d.split("_")[1] + "_8" }]] }, parse_mode: "HTML" })
		}

		else if (d.split("_")[0] == "giveTree2") {
			bot.deleteMessage(message.chat.id, message.message_id);
			giveTree(Number(d.split("_")[1]), Number(d.split("_")[2]))
			bot.sendMessage(Number(d.split("_")[1]), 'Вам выдан танк: ' + trees[Number(d.split("_")[2])].name, { rparse_mode: "HTML" })
			bot.sendMessage(uid, `${trees[Number(d.split("_")[2])].name} выдан пользователю`, { reply_markup: RM_admin_return, parse_mode: "HTML" })
		}
		else if (d.split("_")[0] == "takeTree") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var id = Number(d.split("_")[1])
			var u = await User.findOne({ id })
			var keyboard = { inline_keyboard: [] }
			for (var i = 0; i < u.trees.length; i++) {
				var tree = u.trees[i]
				console.log(tree)
				keyboard.inline_keyboard.push([{ text: trees.find((x) => x.id == tree.id).name, callback_data: "takeTree2_" + id + "_" + i }])
			}
			bot.sendMessage(uid, 'Выберете танк, который необходимо отнять:', { reply_markup: keyboard, parse_mode: "HTML" })
		}
		else if (d.split("_")[0] == "takeTree2") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var id = Number(d.split("_")[1])
			var i = Number(d.split("_")[2])
			var u = await User.findOne({ id })
			u.trees.splice(i, 1)
			await User.findOneAndUpdate({ id }, { trees: u.trees })
			bot.sendMessage(uid, 'Вы успешно забрали танк у пользователя!', { reply_markup: { inline_keyboard: [[{ text: "Назад", callback_data: "takeTree_" + id }]] }, parse_mode: "HTML" })
		}

		else if (d == "a_voucher") {
			bot.deleteMessage(message.chat.id, message.message_id);
			bot.sendMessage(uid, 'Выберете танк для создания чека:', { reply_markup: { inline_keyboard: [[{ text: trees[0].name, callback_data: "voucher_0" }], [{ text: trees[1].name, callback_data: "voucher_1" }], [{ text: trees[2].name, callback_data: "voucher_2" }], [{ text: trees[3].name, callback_data: "voucher_3" }], [{ text: trees[4].name, callback_data: "voucher_4" }], [{ text: trees[5].name, callback_data: "voucher_5" }], [{ text: trees[6].name, callback_data: "voucher_6" }], [{ text: trees[7].name, callback_data: "voucher_7" }], [{ text: trees[8].name, callback_data: "voucher_8" }]] }, parse_mode: "HTML" })
		}
		else if (d.split("_")[0] == "voucher") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var cid = generateID(8)
			await Voucher.insertMany({ id: cid, tree_id: Number(d.split("_")[1]) })
			bot.sendMessage(uid, `Чек создан:\nhttps://t.me/WoT_MoneyBot?start=C${cid}`, { reply_markup: RM_admin_return })
		}
		else if (d == "admin_mm_stop") {
			var tek = Math.round((mm_i / mm_total) * 40)
			var str = ""
			for (var i = 0; i < tek; i++) str += "+"
			str += '>'
			for (var i = tek + 1; i < 41; i++) str += "-"
			mm_status = false;
			bot.editMessageText("Рассылка остановлена!", { chat_id: mm_achatid, message_id: mm_amsgid })
			mm_u = []
		}
		else if (d == "admin_mm_pause") {
			var tek = Math.round((mm_i / mm_total) * 40)
			var str = ""
			for (var i = 0; i < tek; i++) str += "+"
			str += '>'
			for (var i = tek + 1; i < 41; i++) str += "-"
			bot.editMessageText("<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm2, parse_mode: html })
			mm_status = false;
		}
		else if (d == "admin_mm_play") {
			mm_status = true;
			bot.editMessageText("Выполнено: " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n', { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm1 })
		}
		else if (d.split("_")[0] == "ban") {
			var uuid = Number(d.split("_")[1])
			await User.findOneAndUpdate({ id: uuid }, { ban: true })
			bot.editMessageText('<a href="tg://user?id=' + uuid + '">Пользователь</a> заблокирован!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
		}
		else if (d.split("_")[0] == "unban") {
			var uuid = Number(d.split("_")[1])
			await User.findOneAndUpdate({ id: uuid }, { ban: false })
			bot.editMessageText('<a href="tg://user?id=' + uuid + '">Пользователь</a> разбанен!', { chat_id: uid, message_id: message.message_id, parse_mode: html })
		}
		else if (d == "admin_return") {
			bot.deleteMessage(message.chat.id, message.message_id);
			var h = process.uptime() / 3600 ^ 0
			var m = (process.uptime() - h * 3600) / 60 ^ 0
			var s = process.uptime() - h * 3600 - m * 60 ^ 0
			var heap = process.memoryUsage().rss / 1048576 ^ 0
			var b = (await User.findOne({ id: 0 })).deposit
			return qiwi.getBalance(async (err, balance) => {
				bot.sendMessage(uid, '<b>Админ-панель:</b>\n\n<b>Аптайм бота:</b> ' + h + ' часов ' + m + ' минут ' + s + ' секунд\n<b>Пользователей в боте: </b>' + (await User.countDocuments({})) + '\n<b>Памяти использовано:</b> ' + heap + "МБ\n<b>Заявок на вывод:</b> " + await Ticket.countDocuments() + "\n<b>Баланс QIWI:</b> " + balance.accounts[0].balance.amount + "₽\n<b>Бонус к пополнению:</b> " + b + "%", { parse_mode: "HTML", reply_markup: RM_admin })
			})
		}
	}
});

var state = []


User.prototype.inc = function (field, value = 1) {
	this[field] += value;
	return this.save();
}

User.prototype.dec = function (field, value = 1) {
	this[field] -= value;
	return this.save();
}

User.prototype.set = function (field, value) {
	this[field] = value;
	return this.save();
}

function getNavigationIcon(id, tree_id) {
	if (id == tree_id) return '🔵';
	else {
		if (id == 0) return '1️⃣';
		if (id == 1) return '2️⃣';
		if (id == 2) return '3️⃣';
		if (id == 3) return '4️⃣';
		if (id == 4) return '5️⃣';
		if (id == 5) return '6️⃣';
		if (id == 6) return '7️⃣';
		if (id == 7) return '8️⃣';
		if (id == 8) return '9️⃣';
	}
}

function getNavigationQuery(id, tree_id) {
	if (id == tree_id) return 'none';
	else {
		if (id == 0) return 'trees:shop0';
		if (id == 1) return 'trees:shop1';
		if (id == 2) return 'trees:shop2';
		if (id == 3) return 'trees:shop3';
		if (id == 4) return 'trees:shop4';
		if (id == 5) return 'trees:shop5';
		if (id == 6) return 'trees:shop6';
		if (id == 7) return 'trees:shop7';
		if (id == 8) return 'trees:shop8';
	}
}

function getInventoryIcon(id, tree_id) {
	if (id == tree_id) return '🔴';
	else {
		if (id == 0) return '1️⃣';
		if (id == 1) return '2️⃣';
		if (id == 2) return '3️⃣';
		if (id == 3) return '4️⃣';
		if (id == 4) return '5️⃣';
		if (id == 5) return '6️⃣';
		if (id == 6) return '7️⃣';
		if (id == 7) return '8️⃣';
		if (id == 8) return '9️⃣';
	}
}

function getInventoryQuery(id, tree_id) {
	if (id == tree_id) return 'none';
	else {
		if (id == 0) return 'trees:inv0';
		if (id == 1) return 'trees:inv1';
		if (id == 2) return 'trees:inv2';
		if (id == 3) return 'trees:inv3';
		if (id == 4) return 'trees:inv4';
		if (id == 5) return 'trees:inv5';
		if (id == 6) return 'trees:inv6';
		if (id == 7) return 'trees:inv7';
		if (id == 8) return 'trees:inv8';
	}
}

var lastTxnId
async function payeerCheck() {
	require('request')({
		method: 'POST',
		url: 'https://payeer.com/ajax/api/api.php?history',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: `account=${config.payeer.account}&apiId=${config.payeer.apiId}&apiPass=${config.payeer.apiPass}&action=history&count=1&type=incoming`
	}, async function (error, response, body) {
		body = JSON.parse(body)
		for (const txnId in body.history) {
			if (lastTxnId == null) { lastTxnId = txnId; console.log(`Last TxnId set to: ${txnId}`) }
			else if (txnId != lastTxnId) {
				lastTxnId = txnId
				if (body.history[txnId].type != "transfer" || body.history[txnId].status != "success" || !body.history[txnId].comment) return;
				if (body.history[txnId].comment.startsWith('SG')) {
					let id = Number(body.history[txnId].comment.split("SG")[1]);
					let user = await User.findOne({ id });
					if (!user) return;
					await user.inc('game_payin', x.sum.amount);
					await user.inc('game_balance', x.sum.amount);
					await bot.sendMessage(id, `💳 Вы успешно пополнили свой игровой баланс на ${x.sum.amount}₽`);
					bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил игровой баланс на <b>${x.sum.amount}₽</b>`, { parse_mode: "HTML" })
					return
				}

				let user = await User.findOne({ id: Number(body.history[txnId].comment.split("MF")[1]) });
				if (!user) return;
				if (body.history[txnId].creditedCurrency == "RUB")
					var sum = roundPlus(Number(body.history[txnId].creditedAmount))
				else return
				var id = user.id

				var b = (await User.findOne({ id: 0 })).deposit

				if (b == 0) {
					await user.inc('deposit', sum);
					await user.inc('buybalance', sum);
					await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: sum } })
					bot.sendMessage(id, `Ваш баланс пополнен на ${sum}₽ и Вы получаете бонус - ${roundPlus(sum * 0.15)}₽!`);
					bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${sum}₽</b> и получил ${roundPlus(sum * 0.15)}₽ бонусом!`, { parse_mode: "HTML" })
					ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${sum}₽ + ${roundPlus(sum * 0.15)}₽ бонус`, { parse_mode: "HTML" }))
				} else {
					await user.inc('deposit', sum);
					b = b / 100
					await user.inc('buybalance', sum + sum * b);
					await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: sum } })
					bot.sendMessage(id, `Ваш баланс пополнен на ${sum}₽ и Вы получаете бонус - ${roundPlus(sum * b)}₽!`);
					bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${sum}₽</b>`, { parse_mode: "HTML" })
					ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${sum}₽ + ${roundPlus(sum * b)}₽ бонус`, { parse_mode: "HTML" }))
				}
				await User.findOneAndUpdate({ id: user.ref }, { $inc: { buybalance: roundPlus(sum * 0.05) } })
				await User.findOneAndUpdate({ id: user.ref }, { $inc: { outbalance: roundPlus(sum * 0.05) } })
				bot.sendMessage(user.ref, `🤝 Ваш <a href="tg://user?id=${id}">реферал</a> пополнил баланс на <b>${sum}₽</b>!\n💸 Вам начислено по <b>${roundPlus(sum * 0.05)}₽</b> на балансы для покупок и для вывода`, { parse_mode: "HTML" }).catch()
			}
		}
	})
}

if (config.payeer.enabled) {
	setInterval(payeerCheck, 10000)
	payeerCheck()
}

setInterval(async () => {
	qiwi.getOperationHistory({ rows: 10, operation: 'IN' }, (err, response) => {
		response.data.map(async (x) => {
			if (!x.comment) return;
			if (txnId.indexOf(x.txnId) !== -1) return;
			if (x.comment.startsWith('SG')) {
				let id = Number(x.comment.split("SG")[1]);
				let user = await User.findOne({ id });
				if (!user) return;
				await user.inc('game_payin', x.sum.amount);
				await user.inc('game_balance', x.sum.amount);
				await bot.sendMessage(id, `💳 Вы успешно пополнили свой игровой баланс на ${x.sum.amount}₽`);
				bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил игровой баланс на <b>${x.sum.amount}₽</b>`, { parse_mode: "HTML" })
				txnId.push(x.txnId)
				require('fs').writeFileSync('./txnId.json', JSON.stringify(txnId));
				return
			}
			let id = Number(x.comment.split("S")[1]);
			if (!id) return;
			let user = await User.findOne({ id });
			if (!user) return;
			if (x.sum.currency != 643) return;
			var b = (await User.findOne({ id: 0 })).deposit / 100
			var sum = x.sum.amount
			if (b > 0) {
				await user.inc('deposit', x.sum.amount);
				if (user.deposit + x.sum.amount > 100 && !user.not) {
					await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 100₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @duber77`);
					await User.findOneAndUpdate({ id: user.id }, { not: true })
				}

				await user.inc('buybalance', x.sum.amount + x.sum.amount * b);
				await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
				bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽ и Вы получаете бонус - ${roundPlus(x.sum.amount * b)}₽!`);
				bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b> и получил ${roundPlus(x.sum.amount * b)}₽ бонусом!`, { parse_mode: "HTML" })
				ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽ + ${roundPlus(x.sum.amount * b)}₽ бонус`, { parse_mode: "HTML" }))

			}
			else if (b == 0) {
				await user.inc('deposit', x.sum.amount);
				if (user.deposit + x.sum.amount > 100 && !user.not) {
					await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 100₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @duber77`);
					await User.findOneAndUpdate({ id: user.id }, { not: true })
				}
				await user.inc('buybalance', x.sum.amount);
				await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
				bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽`);
				bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b>`, { parse_mode: "HTML" })
				ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽`, { parse_mode: "HTML" }))
			} else {
				await user.inc('deposit', x.sum.amount);
				if (user.deposit + x.sum.amount > 100 && !user.not) {
					await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 100₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @duber77`);
					await User.findOneAndUpdate({ id: user.id }, { not: true })
				}
				b = b / 100
				await user.inc('buybalance', x.sum.amount + x.sum.amount * b);
				await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
				bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽ и Вы получаете бонус - ${roundPlus(x.sum.amount * b)}₽!`);
				bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b> и получил ${roundPlus(x.sum.amount * b)}₽ бонусом!`, { parse_mode: "HTML" })
				ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽ + ${roundPlus(x.sum.amount * b)}₽ бонус`, { parse_mode: "HTML" }))

			}
			await User.findOneAndUpdate({ id: user.ref }, { $inc: { buybalance: roundPlus(x.sum.amount * 0.05) } })
			await User.findOneAndUpdate({ id: user.ref }, { $inc: { outbalance: roundPlus(x.sum.amount * 0.05) } })

			bot.sendMessage(user.ref, `🤝 Ваш <a href="tg://user?id=${id}">реферал</a> пополнил баланс на <b>${x.sum.amount}₽</b>!\n💸 Вам начислено по <b>${roundPlus(x.sum.amount * 0.05)}₽</b> на балансы для покупок и для вывода`, { parse_mode: "HTML" }).catch()

			txnId.push(x.txnId)
			require('fs').writeFileSync('./txnId.json', JSON.stringify(txnId));
		});
	});
}, 10000);

async function mmTick() {
	if (mm_status) {
		try {
			mm_i++
			if (mm_type == "text") {
				if (mm_btn_status)
					bot.sendMessage(mm_u[mm_i - 1], mm_text, { reply_markup: { inline_keyboard: [[{ text: mm_btn_text, url: mm_btn_link }]] }, parse_mode: html }).then((err) => { mm_ok++ }).catch((err) => { mm_err++ })
				else
					bot.sendMessage(mm_u[mm_i - 1], mm_text, { parse_mode: html }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { mm_err++ })
			}
			else if (mm_type == "img") {
				if (mm_btn_status)
					bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text, reply_markup: { inline_keyboard: [[{ text: mm_btn_text, url: mm_btn_link }]] } }).then((err) => { mm_ok++ }).catch((err) => { mm_err++ })
				else
					bot.sendPhoto(mm_u[mm_i - 1], mm_imgid, { caption: mm_text }).then((err) => { console.log((mm_i - 1) + ') ID ' + mm_u[mm_i - 1] + " OK"); mm_ok++ }).catch((err) => { mm_err++ })
			}
			if (mm_i % 10 == 0) {
				var tek = Math.round((mm_i / mm_total) * 40)
				var str = ""
				for (var i = 0; i < tek; i++) str += "+"
				str += '>'
				for (var i = tek + 1; i < 41; i++) str += "-"
				bot.editMessageText("<b>Выполнено:</b> " + mm_i + '/' + mm_total + ' - ' + Math.round((mm_i / mm_total) * 100) + '%\n' + str + "\n\n<b>Статистика:</b>\n<b>Успешных:</b> " + mm_ok + "\n<b>Неуспешных:</b> " + mm_err, { chat_id: mm_achatid, message_id: mm_amsgid, reply_markup: RM_mm1, parse_mode: html })
			}
			if (mm_i == mm_total) {
				mm_status = false;
				bot.editMessageText("Выполнено: " + mm_i + '/' + mm_total, { chat_id: mm_achatid, message_id: mm_amsgid })
				sendAdmins('<b>Рассылка завершена!\n\nСтатистика:\nУспешно:</b> ' + mm_ok + "\n<b>Неуспешно:</b> " + mm_err, { parse_mode: html })
				mm_u = []
			}
		} finally { }
	}
}

setInterval(mmTick, 100);

var mm_total
var mm_i
var mm_status = false
var mm_amsgid
var mm_type
var mm_imgid
var mm_text
var mm_achatid
var mm_btn_status
var mm_btn_text
var mm_btn_link
var mm_ok
var mm_err

async function mm_t(text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
	let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
	mm_total = ut.length
	console.log(ut)
	mm_u = []
	for (var i = 0; i < mm_total; i++)
		mm_u[i] = ut[i].id
	if (size != 100) {
		mm_u = randomizeArr(mm_u)
		mm_total = Math.ceil(mm_total * (size / 100))
		mm_u.length = mm_total
	}
	ut = undefined
	mm_i = 0;
	mm_amsgid = amsgid
	mm_type = "text"
	mm_text = text
	mm_ok = 0
	mm_err = 0
	mm_achatid = achatid
	if (btn_status) {
		mm_btn_status = true
		mm_btn_text = btn_text
		mm_btn_link = btn_link
	}
	else
		mm_btn_status = false
	mm_status = true;
}

bot.on('photo', async msg => {
	if (msg.from != undefined) {
		var uid = msg.from.id
		if (state[uid] == 7770 && ADMINS.indexOf(uid) !== -1) {
			state[uid] = undefined
			var text = ""
			if (msg.caption != undefined) text = msg.caption
			bot.sendMessage(uid, "Рассылка запущена!").then((e) => {
				if (text.split("#").length == 4) {
					var btn_text = text.split("#")[1].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
					var btn_link = text.split("#")[2].split("#")[0].replace(/(^\s*)|(\s*)$/g, '')
					text = text.split("#")[0].replace(/(^\s*)|(\s*)$/g, '').replace(' ', '')
					mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, true, btn_text, btn_link, 100)

				}
				else
					mm_img(msg.photo[msg.photo.length - 1].file_id, text, e.message_id, e.chat.id, false, false, false, 100)

			})
		}
	}
})



async function mm_img(img, text, amsgid, achatid, btn_status, btn_text, btn_link, size) {
	let ut = await User.find({}, { id: 1 }).sort({ _id: -1 })
	mm_total = ut.length
	mm_u = []
	for (var i = 0; i < mm_total; i++)
		mm_u[i] = ut[i].id
	if (size != 100) {
		mm_u = randomizeArr(mm_u)
		mm_total = Math.ceil(mm_total * (size / 100))
		mm_u.length = mm_total
	}

	ut = undefined
	mm_i = 0;
	mm_amsgid = amsgid
	mm_type = "img"
	mm_text = text
	mm_imgid = img
	mm_ok = 0
	mm_err = 0
	mm_achatid = achatid
	if (btn_status) {
		mm_btn_status = true
		mm_btn_text = btn_text
		mm_btn_link = btn_link
	}
	else
		mm_btn_status = false
	mm_status = true;
}

function randomizeArr(arr) {
	var j, temp;
	for (var i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}

const html = "HTML"

function sendAdmins(text, params) { for (var i = 0; i < ADMINS.length; i++) bot.sendMessage(ADMINS[i], text, params) }

var data = []


function roundPlus(number) { if (isNaN(number)) return false; var m = Math.pow(10, 2); return Math.round(number * m) / m; }

async function main() {
	var u = (await User.find({}, { id: 1 })).map((e) => { return e.id })
	for (var i in u) {
		await User.findOneAndUpdate({ id: u[i] }, { refCount: await User.countDocuments({ ref: u[i] }) })
		console.log(i)
	}

}
//main()

// Обработчик пчеломатки с выдачей пчёл
async function beeMotherUpdater() {
	// Удаление старых пчёл
	var bm = await BeeMother.find({ end_time: { $lte: Date.now() } })
	for (var i in bm) {
		var b = bm[i]
		await BeeMother.deleteOne({ _id: String(b._id) })
		bot.sendMessage(b.creator_id, `⚜️ Ваше магическое место принесло 4 супер танка и исчезло`)
	}
	// Выдача диких пчёл
	bm = await BeeMother.find({ beesGet: { $lte: 4 }, nextBeeGet: { $lte: Date.now() } })
	console.log(bm)
	for (var i in bm) {
		var b = bm[i]
		await BeeMother.findOneAndUpdate({ _id: String(b._id) }, { nextBeeGet: b.nextBeeGet + 1000 * 60 * 60 * 24 * 7, beesGet: b.beesGet + 1 })
		await WildBee.insertMany([{ creator_id: b.creator_id, start_time: Date.now(), level: 1, bee_profit: 0 }])
		bot.sendMessage(b.creator_id, `🎖 Магическое место принесло Вам супер танк!`)
	}
}
setInterval(beeMotherUpdater, 1000 * 60 * 60)

// Обработчик выдачи мёда дикими пчёлами
async function wildBeesUpdater() {
	if (new Date().getMinutes() == 0) {
		var wb = await WildBee.find()
		for (var i in wb) {
			var b = wb[i]
			await User.findOneAndUpdate({ id: b.creator_id }, { $inc: { wb_profits: wbProfits[b.level] } })
			await WildBee.findOneAndUpdate({ _id: String(b._id) }, { $inc: { bee_profit: wbProfits[b.level] } })
		}
	}
}
setInterval(wildBeesUpdater, 1000 * 60)

//User.updateMany({}, {payout: 0, not: false}).then()

async function totalEarnCalc() {
	var users = await User.find()
	for (const i in users) {
		try {
			var user = users[i]
			let total_earn = 0;
			user.trees.map((x) => {
				total_earn += trees.find((a) => a.id == x.id).earn
			})
			await User.findOneAndUpdate({ id: user.id }, { totalEarn: total_earn })
			console.log(i + "/" + users.length + " - " + total_earn)
		}
		catch { }
	}
}
setInterval(totalEarnCalc, 1000 * 60 * 15)

async function totalClanEarnCalc() {
	var clans = await Clan.find()
	for (const i in clans) {
		try {
			var clan = clans[i]
			let total_earn = 0;
			var users = await User.find({ clanName: clan.name })
			users.map(u => { total_earn += u.totalEarn })
			await Clan.findOneAndUpdate({ name: clan.name }, { total_earn: total_earn })
			console.log(i + "/" + clans.length + " - " + total_earn)
		}
		catch { }
	}
}

setInterval(totalClanEarnCalc, 1000 * 60 * 15)

async function clanWar() {
	var d = new Date()
	var minutes = d.getMinutes()
	var hours = d.getHours()
	var date = d.getDate()
	if (!(minutes == 0 && hours == 0 && (date == 5 || date == 15 || date == 25))) return
	var d = new Date()
	var clans = await Clan.find({ $and: [{ name: { $ne: "." } }, { name: { $ne: "dsfsdf" } }] }).sort({ total_earn: -1 }).limit(2)
	await Clan.findOneAndUpdate({ name: clans[0].name }, { $inc: { balance: 100000 } })
	await Clan.findOneAndUpdate({ name: clans[1].name }, { $inc: { balance: 50000 } })
	await Clan.findOneAndUpdate({ name: clans[2].name }, { $inc: { balance: 30000 } })
	await Clan.findOneAndUpdate({ name: clans[3].name }, { $inc: { balance: 15000 } })
	await Clan.findOneAndUpdate({ name: clans[4].name }, { $inc: { balance: 5000 } })
	var us = await User.find({ clanName: { $exists: true } }, { id: 1 })
	var nwd = new Date(getNextClanWarTimestamp())
	for (const i in us) {
		try {
			await bot.sendMessage(us[i].id, `
<b>💎 ${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} была проведена битва взводов!</b>\n
🏆 Победил взвод <b>${clans[0].name}</b>
💰 Он получает <b>🎖 100k Голды</b> в казну взвода\n
2 место - <b>${clans[1].name}</b> - получает <b>🎖 50k Голды</b>
3 место - <b>${clans[2].name}</b> - получает <b>🎖 30k Голды</b>
4 место - <b>${clans[3].name}</b> - получает <b>🎖 15k Голды</b>
5 место - <b>${clans[4].name}</b> - получает <b>🎖 5k Голды</b>\n
💎 Следующий бой <b>${nwd.getDate()}.${nwd.getMonth() + 1}.${nwd.getFullYear()}</b>
			`, { parse_mode: "html" });
		}
		catch{ }
	}
}

async function ticker() {
	var d = new Date()
	var minutes = d.getMinutes()
	var hours = d.getHours()
	var date = d.getDate()
	if (minutes == 0 && hours == 0 && (date == 5 || date == 15 || date == 25))
		clanWar()
	if (minutes == 0 && hours == 0)
		await User.updateMany({}, { game_limit: 10, spinsToday: 0 })
}

setInterval(ticker, 1000 * 60)

function getNextClanWarTimestamp() {
	var dt = new Date()
	var m = dt.getMonth()
	var d = dt.getDate()
	if (d < 5) dt.setDate(5)
	else if (d >= 25) {
		dt.setDate(5)
		dt.setMonth(dt.getMonth() + 1)
	}
	else if (d >= 5 && d < 15) dt.setDate(15)
	else if (d >= 15 && d < 25) dt.setDate(25)
	return dt.getTime()
}

Clan.findOneAndUpdate({ name: "👑MARVEL👑" }, { creator_id: 816070668 }).then()

async function giveTree(uid, id) {
	var u = await User.findOne({ id: uid });
	let total_balance = 0;
	u.trees.map((x) => { total_balance += (((Date.now() - u.lastCollect) / 1000) / 60) * (trees.find((a) => a.id == x.id).earn / 60); })
	u.trees.push({ id: id, date: Date.now(), lastCollect: Date.now() });
	await User.findOneAndUpdate({ id: uid }, { lastCollect: Date.now(), fetuses: Number(total_balance.toFixed(2)), trees: u.trees })
}



function randomizeArr(arr) {
	var j, temp;
	for (var i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
	return arr;
}


WildBee.insertMany([{ creator_id: 292966454, start_time: Date.now(), level: 1, bee_profit: 0 }]).then()
/*
async function ma(){
	var response = {data: JSON.parse(fs.readFileSync("trans.txt", {encoding: "utf8"}))}
	response.data.map(async (x) => {
		if (!x.comment) return;
		if (!x.comment.startsWith('S')) return;
		let id = Number(x.comment.split("S")[1]);
		if (!id) return;
		let user = await User.findOne({ id });
		if (!user) return;
		if (x.sum.currency != 643) return;
		var b = (await User.findOne({ id: 0 })).deposit
		var sum = x.sum.amount
		if (sum >= 300) {
			await user.inc('deposit', x.sum.amount);
			if (user.deposit + x.sum.amount > 100 && !user.not) {
				await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 100₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @duber77`);
				await User.findOneAndUpdate({ id: user.id }, { not: true })
			}
			b = 0.15
			await user.inc('buybalance', x.sum.amount + x.sum.amount * 0.15);
			await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
			bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽ и Вы получаете бонус - ${roundPlus(x.sum.amount * 0.15)}₽!`);
			//bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b> и получил ${roundPlus(x.sum.amount * 0.15)}₽ бонусом!`, { parse_mode: "HTML" })
			ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽ + ${roundPlus(x.sum.amount * 0.15)}₽ бонус`, { parse_mode: "HTML" }))

		}
		else if (b == 0) {
			await user.inc('deposit', x.sum.amount);
			if (user.deposit + x.sum.amount > 100 && !user.not) {
				await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 100₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @duber77`);
				await User.findOneAndUpdate({ id: user.id }, { not: true })
			}
			await user.inc('buybalance', x.sum.amount);
			await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
			bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽`);
			//bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b>`, { parse_mode: "HTML" })
			ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽`, { parse_mode: "HTML" }))
		} else {
			await user.inc('deposit', x.sum.amount);
			if (user.deposit + x.sum.amount > 100 && !user.not) {
				await bot.sendMessage(id, `💰 Вы пополнили баланс бота более, чем на 100₽ и приглашаетесь в чат инвесторов!\nПерешлите это сообщение администратору @duber77`);
				await User.findOneAndUpdate({ id: user.id }, { not: true })
			}
			b = b / 100
			await user.inc('buybalance', x.sum.amount + x.sum.amount * b);
			await User.findOneAndUpdate({ id: 0 }, { $inc: { ref: x.sum.amount } })
			bot.sendMessage(id, `Ваш баланс пополнен на ${x.sum.amount}₽ и Вы получаете бонус - ${roundPlus(x.sum.amount * b)}₽!`);
			//bot.sendMessage("@WoT_Pay", `🎖 <a href="tg://user?id=${id}">Пользователь</a> пополнил баланс на <b>${x.sum.amount}₽</b> и получил ${roundPlus(x.sum.amount * b)}₽ бонусом!`, { parse_mode: "HTML" })
			ADMINS.map((a) => bot.sendMessage(a, `<a href="tg://user?id=${id}">Игрок</a> сделал депозит: ${x.sum.amount}₽ + ${roundPlus(x.sum.amount * b)}₽ бонус`, { parse_mode: "HTML" }))

		}
		await User.findOneAndUpdate({ id: user.ref }, { $inc: { buybalance: roundPlus(x.sum.amount * 0.05) } })
		await User.findOneAndUpdate({ id: user.ref }, { $inc: { outbalance: roundPlus(x.sum.amount * 0.05) } })

		bot.sendMessage(user.ref, `🤝 Ваш <a href="tg://user?id=${id}">реферал</a> пополнил баланс на <b>${x.sum.amount}₽</b>!\n💸 Вам начислено по <b>${roundPlus(x.sum.amount * 0.05)}₽</b> на балансы для покупок и для вывода`, { parse_mode: "HTML" }).catch()

		txnId.push(x.txnId)
		require('fs').writeFileSync('./txnId.json', JSON.stringify(txnId));
	});
}

ma()
*/

function randomInteger(min, max) {
	// случайное число от min до (max+1)
	let rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}
User.insertMany([
{ "_id" : "5dfaac928d3ea75ef63263ba", "trees": [ ], "id" : 0, "buybalance" : 0, "outbalance": 0, "bhivebalance" :0, "wb_profits" : 0, "name" : "Infix ©", "fc" : 0, "ref" : 0., "regDate" : "18/12/2019", "deposit" : 0, "payout" : 1100, "fetuses" : 0, "menu" : "{\"price\":20,\"status\":false,\"count\":5,\"bought\":3}", "lastCollect" : 1576709266975, "ban" : false, "refCount" : 0, "not" : false, "__v" : 0, "totalEarn" : 0, "prudLevel" : 0 },
{ "_id" : "5dfbe31493b06e7818e2c5d7", "trees" : [ ], "id" : 1, "menu" : "{\"price\":20,\"status\":true,\"count\":5,\"bought\":3}", "__v" : 0, "totalEarn" : 0, "prudLevel" : 0 }
]).then()
