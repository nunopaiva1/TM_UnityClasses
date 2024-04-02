using UnityEngine;

public class CamFollow : MonoBehaviour
{
    public Transform playerTransform;
    public Vector3 offset;

    private void FixedUpdate()
    {
        //Debug.Log(playerTransform.position);

        transform.position = playerTransform.position + offset;
    }
}
