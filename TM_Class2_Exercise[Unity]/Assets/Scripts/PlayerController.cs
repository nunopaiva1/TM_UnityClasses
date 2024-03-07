using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    //public Rigidbody rb;
    private Rigidbody rb;

    public float forwardForce = 1000f;
    public float sidewaysForce = 500f;

    // Start is called before the first frame update
    void Start()
    {
        rb = GetComponent<Rigidbody>();

        //Disable player's Gravity at start
            //rb.useGravity = false;

        //Adds Force ONCE on Y & Z 
            //rb.AddForce(0, 200, 200);

        //Adds Force ONCE on Y and takes into account FPS (without the Time.deltatime, the higher FPS, the stronger the force will be!
            //rb.AddForce(0, 500, 0 * Time.deltaTime);
    }

    // Update is called once per frame
    void Update()
    {
        //Adds Force EVERY FRAME on Y & Z 
            //rb.AddForce(0, 200, 200 * Time.deltaTime);
    }

    // We use FixedUpdate() instead of Update() to deal with physics
    // Unity expects us to calculate physics on FixedUpdate() -> it also improves the quality and consistency of object collision
    void FixedUpdate()
    {
        //Adds Force EVERY FRAME on Z
        rb.AddForce(0, 0, forwardForce * Time.deltaTime);

        //Adds Force EVERY FRAME while the input key is being pressed
        if (Input.GetKey("a"))
        {
            // Adding negative force to X axis for left movement
            rb.AddForce(-sidewaysForce * Time.deltaTime, 0, 0, ForceMode.VelocityChange);
        }

        if (Input.GetKey("d"))
        {
            // Adding positive force to X axis for right movement
            rb.AddForce(sidewaysForce * Time.deltaTime, 0, 0, ForceMode.VelocityChange);
        }
    }
}
