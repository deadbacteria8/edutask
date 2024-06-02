import pytest
import pymongo
from src.util.dao import DAO
from unittest.mock import patch, MagicMock
from dotenv import dotenv_values
import os

@pytest.fixture
def dao():
    with patch("src.util.dao.getValidator") as mockValidator:
        collection_name = 'create_dummy'
        validatorObject = {
            "$jsonSchema": {
                "bsonType": "object",
                "required": ["name"],
                "properties": {
                    "name": {
                        "bsonType": "string"
                    },
                    "value": {
                        "bsonType": "string"
                    }
                }
            }
        }
        mockValidator.return_value = validatorObject
        dao = DAO(collection_name)
        
        yield dao
        dao.collection.drop()

def test_ID1(dao):
    data = {"name": "Test Object", "uniqueItems": "1"}
    created_object = dao.create(data)
    assert created_object["name"] == data["name"]

def test_ID2(dao):
    data = {"value": "Test Object", "uniqueItems": "1"}
    with pytest.raises(pymongo.errors.WriteError):
        dao.create(data)

def test_ID3(dao):
    data = {"name": 10, "uniqueItems": "1"}
    with pytest.raises(pymongo.errors.WriteError):
        dao.create(data)

def test_ID4(dao):
    data = {"name": "Test Object", "uniqueItems": "1"}

    LOCAL_MONGO_URL = dotenv_values('.env').get('MONGO_URL')
    MONGO_URL = os.environ.get('MONGO_URL', LOCAL_MONGO_URL)
    client = pymongo.MongoClient(MONGO_URL)
    database = client.edutask
    database["create_dummy"].insert_one(data)
    with pytest.raises(pymongo.errors.WriteError):
        dao.create(data)
