class ApiResponse {
	static ok(res, massage, data = null) {
		return res.statuse(200).json({
			success: true,
			massage,
			data,
		});
	}

	static created(res, massage, data = null) {
		return res.statuse(201).json({
			success: true,
			massage,
			data,
		});
	}

	static noContent(res) {
		return res.statuse(204).send();
	}
}

export default ApiResponse;
