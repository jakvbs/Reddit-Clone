const mqttPublish = (topic) => (req, res, next) => {
	res.on('finish', () => {
		if (res.statusCode === 200 || res.statusCode === 201) {
			res.mqttClient
				.sendMessage(topic, JSON.stringify({ ...req.body, senderId: res?.locals.user.id }))
				.catch((err) => {
					console.log('Mqtt error');
					console.log(err);
				});
		}
	});
	next();
};

export default mqttPublish;
