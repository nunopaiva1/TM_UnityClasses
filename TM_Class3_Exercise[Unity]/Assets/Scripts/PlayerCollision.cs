using UnityEngine;

public class PlayerCollision : MonoBehaviour
{

    public PlayerController movement;

    private void OnCollisionEnter(Collision collision)
    {
        //Debug.Log(collision.gameObject.name);

        if(collision.gameObject.tag == "Obstacle")
        {
            Debug.Log("Crash!");
            movement.enabled = false;

            FindObjectOfType<GameManager>().GameOver();
        }
    }

}
