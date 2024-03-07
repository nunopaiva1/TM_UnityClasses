using UnityEngine;

public class PlayerCollision : MonoBehaviour
{

    // Reference to the Player Controller script so we can interact with it from this one
    public PlayerController movement;

    private void OnCollisionEnter(Collision collision)
    {
        Debug.Log("We hit some object!");

        // Detecting collision between Player and Gameobjects named "Obstacle
        if(collision.collider.name == "Obstacle")
        {
            Debug.Log("We hit an obstacle!");
        }

        // Detecting collision between Player and Gameobjects named "Obstacle
        if (collision.collider.tag == "Obstacle")
        {
            Debug.Log("We hit tagged obstacle!");

            // Disabling PlayerController script on collision enter with a tagged object "Obstacle"
            movement.enabled = false;
        }

    }

}
