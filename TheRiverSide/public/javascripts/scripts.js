// Danh sách các đánh giá
const reviews = [
    {
        title: "CONSISTENTLY DELICIOUS",
        text: "“Use this space to share a testimonial quote about the business, its products, or its services. Insert a quote from a real customer or client here to build trust and win over site visitors.”",
        author: "DAN C.",
        rating: "★★★★★"
    },
    {
        title: "A WONDERFUL EXPERIENCE",
        text: "“Amazing ambiance and food. Every dish was a delight, and the service was exceptional. Definitely a place to revisit!”",
        author: "SARAH",
        rating: "★★★★★"
    },
    {
        title: "THE NICEST STAFF SERVING THE BEST FOOD",
        text: "“Use this space to share a testimonial quote about the business, its products or its services. Insert a quote from a real customer or client here to build trust and win over site visitors.”",
        author: "LINDA",
        rating: "★★★★★"
    }
];

let currentReviewIndex = 0;

// Hàm thay đổi đánh giá
function changeReview(direction) {
    currentReviewIndex += direction;

    // Đảm bảo chỉ số đánh giá nằm trong giới hạn
    if (currentReviewIndex < 0) {
        currentReviewIndex = reviews.length - 1; // Về cuối danh sách
    } else if (currentReviewIndex >= reviews.length) {
        currentReviewIndex = 0; // Về đầu danh sách
    }

    // Cập nhật nội dung đánh giá
    document.getElementById("review-title").innerText = reviews[currentReviewIndex].title;
    document.getElementById("review-text").innerText = reviews[currentReviewIndex].text;
    document.getElementById("review-author").innerText = reviews[currentReviewIndex].author;
    document.getElementById("review-rating").innerText = reviews[currentReviewIndex].rating;
}

// Gọi hàm changeReview để thiết lập đánh giá ban đầu
changeReview(0);

/*const reviews = []:tạo mảng tên reviews chứa danh sách các đánh giá
let currentReviewIndex = 0:tạo currentReviewIndex để lưu chỉ số của đánh giá hiện tại trong mảng reviews, bắt đầu từ 0 là đánh giá đầu tiên
funtion changeReview(direction): nhận direction và điều chỉnh currentReviewIndex bằng cách tăng giảm direction
currentReviewIndex += direction: thay đổi currentReviewIndex theo giá trị direction truyền vào
if (currentReviewIndex < 0): đặt nso về vị trí cuối cùng(review.length - 1)
else if (currentReviewIndex >= reviews.length): đặt nó về lại vị trí 0(đánh giá đầu tiên)
document.getElementById để lấy giá trị trong html và cập nhật nội dung dựa trên đánh giá hiện tại
changeReview(0): hiển thị đánh giá đầu tiên ngay khi tải trang, thiết lập diẻction = 0 nên currentReviewIndex kh đổi.


*/ 
