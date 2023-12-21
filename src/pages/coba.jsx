    <Card color="yellow">
                    <div className="w-full">
                      <div className="flex gap-3">
                        <div>
                          <FiAlertTriangle
                            size={25}
                            className="text-yellow-500"
                          />
                        </div>
                        {suggestionData.length > 0 && (
                          <div>
                            {suggestionData.map((suggestion, index) => (
                              <div key={index}>
                                <h2>{suggestion.error4}</h2>
                                <p>{suggestion.message4}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <a
                        href="https://chat.openai.com/share/cb290ced-08a9-4153-93dc-470a1e0fd126"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="mt-2 hover:underline  text-end text-sm">
                          {translations["Learn More"]}
                        </div>
                      </a>
                    </div>
                  </Card> 