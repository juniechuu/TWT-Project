from flask import Flask, render_template, request, redirect, url_for, jsonify, flash
import requests

app = Flask(__name__)
app.secret_key = 'TWT'  # Necessary for flashing messages


from sqlite3 import *
import os

from dateutil.parser import isoparse
from datetime import *
current_datetime = datetime.now()

print("initialize")
userid = 0
fulname = ''

@app.route('/', methods=["POST","GET"])
def index():
    return render_template("index.html")

@app.route('/handlelogout', methods=["POST"])
def handlelogout():
    global userid
    userid = 0
    return render_template("index.html")

@app.route('/login',methods=["POST","GET"])
def login():
    return render_template("login.html")

@app.route('/signup',methods=["POST","GET"]) 
def signup():
    email = request.form.get("email")
    password = request.form.get("password")
    confirmpass = request.form.get("confirm_password")

    success = False
    message1 = ''
    message2 = ''
    if email and password and confirmpass:
        db = connect('library.db')
        c = db.cursor()
        c.execute('''SELECT email FROM students WHERE email = :email''',{"email": email})
        existingemail = c.fetchone()
        if password == confirmpass and not existingemail:
            name = request.form.get("name")
            phone = request.form.get("phone")
            gender = request.form.get("gender")
            identificationnum = request.form.get("ic_num")
            city = request.form.get("city")
            state = request.form.get("state")
            address = request.form.get("address")
            zipcode = request.form.get("zipcode")
            c.execute('''INSERT INTO students(email,password,name,
phone,gender,ic,city,state,address,zipcode) VALUES(?,?,?,?,?,?,?,?,?,?)''',
                      (email,password,name,phone,gender,identificationnum,city,state,address,zipcode))

            db.commit()
            db.close()
            
            success = True
            flash('Succesfully signed up!')
            return render_template("login.html", msg="Sign Up Successfully!") 
        else:
            if existingemail:
                message1 = 'Email already exists!'
            if password != confirmpass:
                message2 = 'Passwords do not match'

    return render_template("signup.html", message1 = message1,message2=message2, success = success)


@app.route('/dashboard', methods=["POST","GET"])
def handlelogin():
    email = request.form.get("email")
    password = request.form.get("password")
    
    db = connect('library.db')
    c = db.cursor()
    c.execute('''SELECT * FROM students WHERE email = :email''', {"email": email})
    info = c.fetchone()
    
    ##VERIFYING LOGIN INFO
    if info:    ## email, password exists from database
        patientitem = info[6]
        emailitem = info[1]
        passworditem = info[2]
        fnameitem = info[3]
    else: ## unable to index a NoneType for email; doesn't exist in database
        emailitem,passworditem = None,None
        success = True
        message0 = "Email does not exist!"
        flash('Incorrect password or email does not exist!')
        return redirect(url_for('login'))
        

    if emailitem != email or passworditem != password: ## if email or password incorrect, return back login
        success = True
        message4 = "Incorrect password OR email does not exist!"
        return redirect(url_for('login'))
    global userid
    global fulname
    userid = patientitem
    fulname = fnameitem
    db.commit()
    db.close()

    return render_template("dashboard.html", name=fnameitem, email=emailitem, password=passworditem)



@app.route('/dashboardTrigger', methods=["POST","GET"])
def dashboardTrigger():

    search = request.form.get("search")
    category = request.form.get("category")
    sort = request.form.get("sort")

    db = connect('library.db')
    c = db.cursor()
    global userid 

    if request.form.get(category):
        category2 = request.form.get(category)
        print(category2)

    

    if category == "all":
        category = None

    if category and search and sort:
        c.execute('''SELECT * FROM books WHERE book_title LIKE ? OR book_title LIKE ? AND book_genre = ? AND book_status = 'Available';''', (search+ "%","%" + search + "%",category))
        bookinfo = c.fetchall()
    if category and search: #both category and search
        c.execute('''SELECT * FROM books WHERE book_title LIKE ? OR book_title LIKE ? AND book_genre = ? AND book_status = 'Available';''', (search+ "%","%" + search + "%",category))
        bookinfo = c.fetchall()
    elif category and not search: ##category only
        search = str(search) + "%"
        c.execute('''SELECT * FROM books WHERE book_genre = :book_genre AND book_status = 'Available';''', {"book_genre":category})
        bookinfo = c.fetchall()
    elif search and not category: ##search
        search = str(search) + "%"
        c.execute('''SELECT * FROM books WHERE book_title LIKE ? OR book_title LIKE ? AND book_status = 'Available';''', (search+ "%","%" + search + "%"))
        bookinfo = c.fetchall()
    else:
        c.execute('''SELECT * FROM books WHERE book_status = 'Available';''') ## load shopping products
        bookinfo = c.fetchall()

    db.commit()
    db.close()

    return jsonify(bookinfo)

# SELECT pat_id FROM students WHERE pat_id = :pat_id
@app.route('/dashboardTriggerBR', methods=["POST"])
def dashboardTriggerBR():
    db = connect('library.db')
    c = db.cursor()
    global userid
    c.execute('''SELECT * FROM books 
                 WHERE borrow_status = 'Pending' AND requester_id = :requester_id;
              ''', {"requester_id": userid})
    bookrequest = c.fetchall()
    print("helloword:", userid)
    db.commit()
    db.close()
    return jsonify(bookrequest)

@app.route('/dashboardTriggerBReturn', methods=["POST"])
def dashboardTriggerBReturn():
    db = connect('library.db')
    c = db.cursor()
    global userid
    c.execute('''SELECT * FROM books 
                 WHERE book_status = 'Borrowed' AND requester_id = :requester_id;
              ''', {"requester_id": userid})
    bookrequest = c.fetchall()
    db.commit()
    db.close()
    return jsonify(bookrequest)



@app.route('/dashboardTriggerBH', methods=["POST"])
def dashboardTriggerBH():
    db = connect('library.db')
    c = db.cursor()
    global userid 
    c.execute('''SELECT * FROM history''')
    bookhistory = c.fetchall()
    db.commit()
    db.close()
    return jsonify(bookhistory)

@app.route('/admindashboardPR', methods=["POST"])
def admindashboardPR():
    db = connect('library.db')
    c = db.cursor()
    global userid 
    c.execute('''SELECT * FROM books WHERE borrow_status = 'Pending';''')
    appointmentinfo = c.fetchall()
    db.commit()
    db.close()
    return jsonify(appointmentinfo)

@app.route('/admindashboardSL', methods=["POST"])
def admindashboardSL():
    db = connect('library.db')
    c = db.cursor()
    global userid 
    c.execute('''SELECT * FROM students''')
    appointmentinfo = c.fetchall()
    db.commit()
    db.close()
    return jsonify(appointmentinfo)

@app.route('/admindashboardBL', methods=["POST"])
def admindashboardBL():
    db = connect('library.db')
    c = db.cursor()
    global userid 
    c.execute('''SELECT * FROM books ORDER BY
                 CASE
                    WHEN book_status = 'Available' THEN 1
                    WHEN book_status = 'Unavailable' THEN 2
                    WHEN book_status = 'Borrowed' THEN 3
                    ELSE 4
                 END''')
    booklist = c.fetchall()
    db.commit()
    db.close()
    return jsonify(booklist)

@app.route('/adminlogin',methods=["POST","GET"])
def adminlogin():
    return render_template("adminlogin.html", flash_message="FALSE")

@app.route('/adminDashboardTrigger', methods=["POST"])
def adminDashboardTrigger():
    db = connect('dental.db')
    c = db.cursor()
    c.execute('''SELECT appointment.*, patient.name AS pat_name
                FROM appointment
                JOIN patient ON appointment.patid = patient.pat_id
                WHERE appointment.appointment_status = 'Approved';''')
    appointmentinfo = c.fetchall()
    for i in range(len(appointmentinfo)):
        original_third_data = appointmentinfo[i][2]  # Get the original third data
        if(original_third_data == "12"):
            formatted_third_data = f"12:00:00.000000"  # Format as 0X:00:00.000000
        elif(original_third_data == "1"):
            formatted_third_data = f"13:00:00.000000"  # Format as 0X:00:00.000000
        elif(original_third_data == "2"):
            formatted_third_data = f"14:00:00.000000"  # Format as 0X:00:00.000000
        elif(original_third_data == "3"):
            formatted_third_data = f"15:00:00.000000"  # Format as 0X:00:00.000000
        elif(original_third_data == "4"):
            formatted_third_data = f"16:00:00.000000"  # Format as 0X:00:00.000000

        appointmentinfo[i] = (
            appointmentinfo[i][0],
            appointmentinfo[i][1],
            formatted_third_data,
            appointmentinfo[i][3],
            appointmentinfo[i][4],
            appointmentinfo[i][5],
            appointmentinfo[i][6]
        )

    currentDateTime = datetime.now()
    filtered_appointments = [
    appointment for appointment in appointmentinfo
    if datetime.strptime(appointment[1] + ' ' + appointment[2], '%Y-%m-%d %H:%M:%S.%f') >= currentDateTime
    ]

    db.commit()
    db.close()
    return jsonify(filtered_appointments)

@app.route('/admindashboard', methods=["POST","GET"])
def admindashboard():
    admin_id = request.form.get("admin_id")
    admin_pw = request.form.get("admin_pw")
    

    db = connect('library.db')
    c = db.cursor()
    c.execute('''SELECT * FROM admin WHERE admin_id = :admin_id''', {"admin_id": admin_id})
    info = c.fetchone()
    
    ##VERIFYING LOGIN INFO
    if info:    ## email, password exists from database
        adminiditem = info[0]
        adminnameitem = info[1]
        adminemailitem = info[2]
        adminpassworditem = info[3]
    else: ## unable to index a NoneType for email; doesn't exist in database
        adminiditem,adminpassworditem = None,None
        success = True
        message3 = "ID DOES NOT EXIST!"
        flash('Incorrect Admin ID or Password!\n                        Please contact Administrator!')
        return redirect(url_for('adminlogin'))
        

    if adminiditem != admin_id or adminpassworditem != admin_pw: ## if email or password incorrect, return back login
        success = True
        message4 = "Incorrect password!"
        return redirect(url_for('adminlogin'))
    

    return render_template("admindashboard.html")

@app.route('/addabook',methods=["POST"]) 
def addabook():
    email = request.form.get("email")
    password = request.form.get("password")
    
    db = connect('library.db')
    c = db.cursor()
    bookisbn = request.form.get("addISBN")
    booktitle = request.form.get("addTitle")
    bookauthor = request.form.get("addAuthor")
    bookgenre = request.form.get("genre")
    bookdesc = request.form.get("addDesc")
    global userid 
    c.execute('''INSERT INTO books(book_isbn,book_title,book_author,book_description,book_status,book_genre) VALUES(?,?,?,?,?,?)''',
                (bookisbn,booktitle,bookauthor,bookdesc,"Available",bookgenre)) 
    db.commit()
    db.close()
    
    
    return render_template("admindashboard.html")

@app.route('/setStatus', methods=["POST"])
def setStatus():
    
    global userid
    status = request.form.get("status")
    aid = request.form.get("aid")
    currentDateTime = request.form.get("currentDateTime")
    availability = request.form.get("availability")
    
    # Debugging
    print(status)
    print(aid)
    print(currentDateTime)
    print(availability)
    print(userid)

    db = connect('library.db')
    c = db.cursor()
    c.execute('''UPDATE books 
                 SET borrow_status = ?, book_status = ?, date_request = ?, requester_id =?
                 WHERE book_isbn = ?''', 
                 (status, availability, currentDateTime, userid, aid))
   
    db.commit()
    db.close()
    return render_template("dashboard.html", name=fulname)

@app.route('/setDelete', methods=["POST","GET"])
def setDelete():
    
    global userid
    global fulname
    status = request.form.get("status2")
    aid = request.form.get("aid2")
    currentDateTime = request.form.get("currentDateTime")
    availability = request.form.get("availability2")
    print(status)
    print(aid)
    print(availability)
    print(userid)

    db = connect('library.db')
    c = db.cursor()
    c.execute('''UPDATE books 
                 SET borrow_status = ?, book_status = ?, date_request = ?, requester_id =?
                 WHERE book_isbn = ?''', 
                 (status, availability, currentDateTime, userid, aid))
   
    db.commit()
    db.close()
    return render_template("dashboard.html", name=fulname)

@app.route('/setApprove', methods=["POST"])
def setApprove():
    
    global userid
    global fulname
    status = request.form.get("status")
    aid = request.form.get("aid")
    availability = request.form.get("availability")

    db = connect('library.db')
    c = db.cursor()
    c.execute('''UPDATE books 
                 SET borrow_status = ?, book_status = ?
                 WHERE book_isbn = ?''', (status, availability, aid))
   
    db.commit()
    db.close()

    if status == "Approved":
        db = connect('library.db')
        c = db.cursor()

        # Insert current row into history table
        c.execute('''
            INSERT INTO history (book_isbn1, book_title1, date_requested1, requester_id1)
            SELECT book_isbn, book_title, date_request, requester_id
            FROM books
            WHERE book_isbn = ?
        ''', (aid,))

        db.commit()
        db.close()

    return render_template("admindashboard.html")

app.run(debug=True, port=5000)