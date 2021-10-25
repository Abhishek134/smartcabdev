// const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require("firebase-functions"), admin = require("firebase-admin"),
    stripe = require("stripe")("sk_test_pgV8EG9WiPs1nDymE9WQFd5x"), TRIP_STATUS_WAITING = "waiting",
    TRIP_STATUS_GOING = "going", TRIP_STATUS_FINISHED = "finished", PAYMENT_METHOD_CARD = "card";

function sendMessage(e, a, n) {
    return void 0 === e || "" === e || null === e || admin.messaging().sendToDevice([e], {
        notification: {
            title: a,
            body: n,
            sound: "default"
        }
    }).then(e => !0).catch(e => !1)
}

admin.initializeApp(), exports.sendPush = functions.database.ref("notifications/{notification}").onWrite(function (e, a) {
    const n = e.after.val();
    "riders" == n.type ? admin.database().ref("passengers").once("value", function (e) {
        e.forEach(e => {
            let a = e.val();
            if (!a.isPushEnabled) return !1;
            sendMessage(a.pushToken, n.title, n.description)
        })
    }) : "drivers" == n.type ? admin.database().ref("drivers").once("value", function (e) {
        e.forEach(e => {
            let a = e.val();
            if (!a.isPushEnabled) return !1;
            sendMessage(a.pushToken, n.title, n.description)
        })
    }) : "both" == n.type && (admin.database().ref("passengers").once("value", function (e) {
        e.forEach(e => {
            let a = e.val();
            if (!a.isPushEnabled) return !1;
            sendMessage(a.pushToken, n.title, n.description)
        })
    }), admin.database().ref("drivers").once("value", function (e) {
        e.forEach(e => {
            let a = e.val();
            if (!a.isPushEnabled) return !1;
            sendMessage(a.pushToken, n.title, n.description)
        })
    }))
}), exports.deleteRider = functions.database.ref("/passengers/{id}").onDelete(function (e, a) {
    const n = a.params.id;
    admin.auth().deleteUser(n).then(() => (console.log("Deleted: " + n), !1)).catch(e => (console.log(e), !1))
}), exports.deleteDriver = functions.database.ref("/drivers/{id}").onDelete(function (e, a) {
    const n = a.params.id;
    admin.auth().deleteUser(n).then(() => (console.log("Deleted: " + n), !1)).catch(e => (console.log(e), !1))
}), exports.makeReport = functions.database.ref("/trips/{tripId}").onWrite(function (e, a) {
    if (!e.before.val()) return !1;
    const n = e.after.val(), t = e.before.child("status").val(), s = a.params.tripId;
    if ("waiting" == t && "going" == n.status) {
        var i = parseFloat(n.fee).toFixed(2);
        if ("card" == n.paymentMethod) if (admin.database().ref("drivers/" + n.driverId + "/balance").once("value").then(function (e) {
            if (null != e && null != e && NaN != e) {
                var a = e.val() ? parseFloat(e.val()) : 0, t = (parseFloat(a) + parseFloat(n.commission)).toFixed(2);
                admin.database().ref("drivers/" + n.driverId + "/balance").set(t)
            }
        }), "$" == n.currency) {
            const e = "usd";
            admin.database().ref("passengers/" + n.passengerId + "/card").once("value").then(function (n) {
                stripe.charges.create({
                    amount: parseInt(100 * i),
                    currency: e,
                    source: n.val().token,
                    description: "Charge for tripId: " + a.params.tripId
                }, {idempotency_key: a.params.tripId}, function (e, a) {
                    console.log(e), console.log(a), null == e ? (console.log("STRIPE CHARGED:" + i), admin.database().ref("trips/" + s).update({
                        paymentStatus: "success",
                        paymentId: a.id
                    })) : (console.log("STRIPE CHARGED FAILED:" + i), admin.database().ref("trips/" + s).update({paymentStatus: "failed"}))
                })
            })
        } else console.log("Currency " + n.currency + " is not supported")
    }
    return "finished" == n.status && "going" == t && (admin.database().ref("/trips").orderByChild("driverId").equalTo(n.driverId).once("value", function (e) {
        var a = 0, t = 0;
        if (null != e) {
            e.forEach(function (e) {
                null != e.val().rating && (a += parseInt(e.val().rating), t++)
            });
            var s = a / t;
            console.log("Rating:" + s), "NaN" != s && admin.database().ref("/drivers/" + n.driverId).update({rating: s.toFixed(1)})
        }
    }), !0)
});

