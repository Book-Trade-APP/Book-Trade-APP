from bson import ObjectId
# collection cart
# old:
product_id = [
    ObjectId('67595e27df035ca464ff2dba'),
    ObjectId('675958f77edaae5261c7adea'),
    ObjectId('675d8dc570408f66838017d1')
]

# new:
products = [
    {
         "_id": ObjectId("67595e27df035ca464ff2dba"),
         "quantity": 1
    },
    {
         "_id": ObjectId("675d8dc570408f66838017d1"),
         "quantity": 3
    },
    
]

target = "675d8dc570408f66838017d1"
quantity = 3


for d in products:
    if d.get("_id") == ObjectId(target):
        d["quantity"] += 1
    else:
        new_product_id = {
            "_id": ObjectId(target),
            "quantity": quantity
        }
        products.append()