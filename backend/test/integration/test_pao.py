import pytest
from src.util.dao import DAO

@pytest.fixture
def dao():
    collection_name = 'create_dummy'
    dao = DAO(collection_name)
    yield dao
    
    dao.collection.drop()

def test_create_success(dao):
    data = {"name": "Test Object", "value": "asd"}
    created_object = dao.create(data)
    assert created_object is not None
    assert "_id" in created_object
    assert created_object["name"] == data["name"]
    assert created_object["value"] == data["value"]
