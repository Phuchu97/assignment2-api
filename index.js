const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../asm2-api/Models/User');
const Hotel = require('../asm2-api/Models/Hotel');
const Room = require('../asm2-api/Models/Room');
const Transaction = require('../asm2-api/Models/Transaction');
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'ksdkaskdksaooasdsaduak2kdsakkad4ksda';

app.use(cors({
    credentials: true,
    origin: '*'
}));
app.use(express.json());

mongoose.connect(process.env.mongoose_URL)
.then(() => {
    console.log('Database connection successful')
  })
  .catch(err => {
    console.error('Database connection error')
  })

app.post('/login', async (req, res) => {
    const {username,password} = req.body;
    const checkUser = await User.findOne({username});
    if(checkUser) {
        const passOk = bcrypt.compareSync(password, checkUser.password);
        if(passOk) {
            jwt.sign({username: checkUser.username, id: checkUser._id},jwtSecret, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json({message: 'password ok',userId: checkUser._id, statusCode: 200})
            })
        } else {
            res.status(422).json({message: 'password not ok', statusCode: 500})
        }
    } else {
        res.json('not found')
    }
})

app.post('/register', async (req, res) => {
    const {username,password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        res.json(userDoc);
    }
    catch (e) {
        res.status(422).json(e)
    }
})


// Lấy danh sách khách sạn

app.get('/hotels', async (req, res) => {
    try {
        const getAll = await Hotel.find({});
        res.json(getAll)
    } 
    catch (e) {
        res.status(422).json(e)
    }
});

// Lấy chi tiết khách sạn

app.post('/hotels/hotel-detail', async (req, res) => {
    const {id} = req.body;
    try {
        const hotel = await Hotel.findOne({_id: id})
        res.json({message: 'Successfully!',hotel: hotel, statusCode: 200})
    } catch (e) {
        res.status(422).json({message: 'Successfully!', statusCode: 500})
    }
});


// Thêm mới Khách sạn

app.post('/hotels/hotel-add', async (req, res) => {
    const {
        name,
        type,
        distance,
        price,
        city,
        address,
        photos,
        rating,
        featured,
        room,
        title,
    } = req.body;
    
    try {
        const hotelDoc = await Hotel.create({
            name,
            type,
            distance,
            price,
            city,
            address,
            photos,
            rating,
            featured,
            room,
            title,
        })
        res.json({message: 'Successfully!', data: hotelDoc, statusCode: 200});
    }
    catch (e) {
        res.status(422).json({message: 'Failed!', statusCode: 200})
    }
})

// Xóa khách sạn

app.delete('/hotels/hotel-delete', async (req, res) => {
    const {id} = req.body;
    try {
        await Hotel.deleteOne({_id: id})
        res.json({message: 'Successfully!', statusCode: 200})
    } catch (e) {
        res.status(422).json({message: 'Successfully!', statusCode: 500})
    }
});


// lay danh sach room

app.get('/rooms', async (req, res) => {
    try {
        const getAll = await Room.find({});
        res.json(getAll)
    } 
    catch (e) {
        res.status(422).json(e)
    }
});


// Them moi phong

app.post('/rooms/room-add', async (req, res) => {
    const {
        title,
        hotelId,
        rooms,
        price,
        maxPeople,
        description,
        startDate,
        endDate
    } = req.body;
    
    try {
        const roomDoc = await Room.create({
            title,
            hotelId,
            rooms,
            price,
            maxPeople,
            description,
            startDate,
            endDate
        })
        res.json({message: 'Successfully!', data: roomDoc, statusCode: 200});
    }
    catch (e) {
        res.status(422).json({message: 'Failed', statusCode: 500})
    }
});

// Xoa phong

app.delete('/rooms/room-delete', async (req, res) => {
    const {id} = req.body;
    try {
        await Room.deleteOne({_id: id})
        res.json({message: 'Successfully!', statusCode: 200})
    } catch (e) {
        res.status(422).json({message: 'Failed!', statusCode: 500})
    }
});


// Check room with hotel

app.post('/rooms/check-hotel', async (req, res) => {
    const {idHotel} = req.body;
    try {
        const hotels = await Room.find({hotelId: idHotel})
        res.json({message: 'Successfully!',hotel: hotels, statusCode: 200})
    } catch (e) {
        res.status(422).json({message: 'Successfully!', statusCode: 500})
    }
});


app.post('/rooms/filter-date-room', async (req, res) => {
    const {startDate, endDate, hotelId} = req.body;
    try {
        const rooms = await Room.find({hotelId: hotelId});
        let newRooms = rooms.filter(obj => {
            let objStartDate = new Date(obj.startDate).getTime();
            let objEndDate = new Date(obj.endDate).getTime();
            if(objEndDate <= new Date(endDate).getTime()) {
                return true;
            } else {
                return false;
            }
        });
        res.json({message: 'Successfully!',rooms: newRooms, statusCode: 200})
    } catch (e) {
        res.status(422).json({message: 'Successfully!', statusCode: 500})
    }
});


// Thêm mới giao dịch

app.post('/transactions/transaction-add', async (req, res) => {
    const {
        userId,
        hotelId,
        rooms,
        startDate,
        endDate,
        price,
        payment,
        status,
        email,
        name,
        phone,
        card
    } = req.body;
    
    try {
        const transactionDoc = await Transaction.create({
            userId,
            hotelId,
            rooms,
            startDate,
            endDate,
            price,
            payment,
            status,
            email,
            name,
            phone,
            card
        })
        res.json({message: 'Successfully!', data: transactionDoc, statusCode: 200});
    }
    catch (e) {
        res.status(422).json({message: 'Failed', statusCode: 500})
    }
});


// Lấy danh sách giao dịch


app.get('/transactions-list', async (req, res) => {
    try {
        const getAll = await Transaction.find({});
        res.json({message: 'Lấy dữ liệu thành công!', list: getAll, statusCode: 200})
    } 
    catch (e) {
        res.json({message: 'Failed!', statusCode: 500})
    }
});




app.listen(4000);