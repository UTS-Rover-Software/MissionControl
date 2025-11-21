def test_basic():
    assert True


def test_example_green():
    # Example of a green test with mock
    from unittest.mock import Mock

    mock_func = Mock()
    mock_func()
    assert mock_func.called


def test_get_latest_telemetry():
    pass


def test_get_telemetry_health():
    pass


def test_get_sensors_vescs():
    pass


def test_get_sensors_encoders():
    pass


def test_get_sensors_rgbd():
    pass


def test_get_sensors_payload():
    pass
