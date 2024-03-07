using UnityEngine;

public class FollowPlayer : MonoBehaviour
{

    // Public reference to the player Transform component assigned on the Unity Editor
    public Transform playerTransform;
    public Vector3 offset;

    void Update()
    {
        //Debug.Log(playerTransform.position);

        // The "tranform" refer to the Transform component of the Gameobject that runs this script!
        transform.position = playerTransform.position + offset;

    }
}
