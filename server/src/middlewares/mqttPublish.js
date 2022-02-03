const mqttPublish = (topic) => (req, res, next) => {
	res.on('finish', () => {
		if (res.statusCode === 200 || res.statusCode === 201) {
			try {
				res.mqttClient.sendMessage(topic, JSON.stringify({ ...req.body, senderId: res?.locals.user.id }));
			} catch (error) {
				console.log(error);
			}
		}
	});
	next();
};

export default mqttPublish;
