import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import static org.hamcrest.Matchers.*;

public class ApiTests {
    private String eventId;
    private String userId;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = "http://localhost:5000";

        Response eventResponse = RestAssured.given()
            .contentType("application/json")
            .body("{\"title\":\"Test Event\",\"date\":\"2025-07-01T10:00:00Z\",\"location\":\"Calgary, AB\",\"description\":\"Test event\",\"category\":\"environment\"}")
            .when().post("/events");
        eventId = eventResponse.jsonPath().getString("_id");

        Response userResponse = RestAssured.given()
            .contentType("application/json")
            .body("{\"name\":\"Harsimran Singh\",\"email\":\"simransandhu315@gmail.com\",\"eventId\":\"" + eventId + "\"}")
            .when().post("/users/register");
        userId = userResponse.jsonPath().getString("userId");
    }

    @Test
    public void testCreateEvent() {
        RestAssured.given()
            .contentType("application/json")
            .body("{\"title\":\"Calgary Park Cleanup\",\"date\":\"2025-07-01T10:00:00Z\",\"location\":\"Calgary, AB\",\"description\":\"Community cleanup event\",\"category\":\"environment\"}")
            .when().post("/events")
            .then().statusCode(201)
            .body("title", equalTo("Calgary Park Cleanup"));
    }

    @Test
    public void testRegisterUser() {
        RestAssured.given()
            .contentType("application/json")
            .body("{\"name\":\"Harsimran Singh\",\"email\":\"test" + System.currentTimeMillis() + "@gmail.com\",\"eventId\":\"" + eventId + "\"}")
            .when().post("/users/register")
            .then().statusCode(201)
            .body("message", equalTo("Registration successful"));
    }

    @Test
    public void testGetUserEvents() {
        RestAssured.given()
            .when().get("/users/" + userId + "/events")
            .then().statusCode(200)
            .body("length()", greaterThan(0))
            .body("[0].title", equalTo("Test Event"));
    }
}