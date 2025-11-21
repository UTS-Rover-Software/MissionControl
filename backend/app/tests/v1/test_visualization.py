def test_basic():
    assert True


def test_example_green():
    # Example of a green test with mock
    from unittest.mock import Mock

    mock_func = Mock()
    mock_func()
    assert mock_func.called


def test_get_current_slam_map():
    pass


def test_get_current_pose():
    pass
