using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;

public class ScoreController : MonoBehaviour
{
    public GameObject player;
    public TMP_Text scoreText;

    void Update()
    {
        scoreText.text = player.transform.position.z.ToString("0");
    }

}
